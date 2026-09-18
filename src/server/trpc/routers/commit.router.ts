import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
        where: { id: input.id, userId: ctx.user_id },
      });
      if (!project) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Request",
        });
      }
      const { data: repo } = await ctx.octokit.request(
        "GET /repositories/{id}",
        { id: project.github_id },
      );
      const { data: commits } = await ctx.octokit.rest.repos.listCommits({
        owner: repo.owner.login as string,
        repo: repo.name as string,
        page,
        per_page: 5,
      });

      const r = commits.map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        url: commit.html_url,
        committer: {
          name: commit.commit.author?.name,
          username: commit.author?.login,
          imageUrl: commit.author?.avatar_url,
        },
        committedAt: commit.commit.author?.date,
      }));

      return {
        commits: r,
        nextCursor: r.length === 5 ? page + 1 : undefined,
      };
    }),
});
