import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { generateCommitSummary } from "@/server/ai/generate-commit-summary";

const MAX_SUMMARIZED_COMMITS = 2;
const COMMITS_PER_PAGE = 1;

// TODO : Hanlde the top latest commits not just the summarized ones. There is a problem when limit is over but new commits are done.

export const commitRouter = createTRPCRouter({
  getCommits: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const page = input.cursor ?? 1;

      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.user_id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Request",
        });
      }

      // Count how many commits have already been summarized.
      const summarizedCount = await ctx.prisma.commit.count({
        where: {
          projectId: project.id,
          aiSummary: {
            not: null,
          },
        },
      });

      const { data: repo } = await ctx.octokit.request(
        "GET /repositories/{id}",
        {
          id: project.github_id,
        },
      );

      // Always fetch the page normally.
      const { data: commits } = await ctx.octokit.rest.repos.listCommits({
        owner: repo.owner.login as string,
        repo: repo.name as string,
        page,
        per_page: COMMITS_PER_PAGE,
      });

      const shas = commits.map((commit) => commit.sha);

      // Find commits that already exist in our DB.
      const dbCommits = await ctx.prisma.commit.findMany({
        where: {
          projectId: project.id,
          sha: {
            in: shas,
          },
        },
        select: {
          sha: true,
          aiSummary: true,
        },
      });

      const processedCommits = new Map(
        dbCommits
          .filter((commit) => commit.aiSummary !== null)
          .map((commit) => [commit.sha, commit.aiSummary]),
      );

      // Only commits without an existing summary need processing.
      const commitsToProcess = commits.filter(
        (commit) => !processedCommits.has(commit.sha),
      );

      // How many summaries can still be generated?
      const remainingSummarySlots = Math.max(
        0,
        MAX_SUMMARIZED_COMMITS - summarizedCount,
      );

      // Only process commits while we have room under the global limit.
      const commitsToSummarize = commitsToProcess.slice(
        0,
        remainingSummarySlots,
      );

      const generatedSummaries = await Promise.all(
        commitsToSummarize.map(async (commit) => {
          const { data: diff } = await ctx.octokit.rest.repos.getCommit({
            owner: repo.owner.login as string,
            repo: repo.name as string,
            ref: commit.sha,
            mediaType: {
              format: "diff",
            },
          });

          const summary = await generateCommitSummary(
            commit.commit.message,
            diff,
          );

          return {
            commit,
            summary,
          };
        }),
      );

      // Save generated summaries before returning.
      if (generatedSummaries.length > 0) {
        await ctx.prisma.$transaction(
          generatedSummaries.map(({ commit, summary }) =>
            ctx.prisma.commit.upsert({
              where: {
                projectId_sha: {
                  projectId: project.id,
                  sha: commit.sha,
                },
              },
              create: {
                projectId: project.id,
                sha: commit.sha,
                aiSummary: summary,
              },
              update: {
                aiSummary: summary,
              },
            }),
          ),
        );
      }

      const summariesBySha = new Map<string, string | null>(
        dbCommits.map((commit) => [commit.sha, commit.aiSummary]),
      );

      for (const { commit, summary } of generatedSummaries) {
        summariesBySha.set(commit.sha, summary);
      }

      /*
       * Only return:
       *   1. Already processed commits
       *   2. Commits that we processed during this request
       *
       * If a commit is unprocessed AND we have reached the maximum,
       * it is excluded from the response.
       */
      const r = commits
        .filter((commit) => summariesBySha.has(commit.sha))
        .map((commit) => ({
          sha: commit.sha,
          message: commit.commit.message,
          url: commit.html_url,
          aiSummary: summariesBySha.get(commit.sha) ?? null,
          committer: {
            name: commit.commit.author?.name,
            username: commit.author?.login,
            imageUrl: commit.author?.avatar_url,
          },
          committedAt: commit.commit.author?.date,
        }));

      /*
       * Pagination is based on the GitHub response, NOT `r.length`.
       *
       * Even if every commit on this page was skipped because the
       * processing limit was reached, we still move to the next page.
       */
      return {
        commits: r,
        nextCursor: r.length === COMMITS_PER_PAGE ? page + 1 : undefined,
      };
    }),
});
