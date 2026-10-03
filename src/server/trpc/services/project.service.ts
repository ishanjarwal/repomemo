import { NewProjectSchema } from "@/features/project/schema";
import { prisma as defaultPrisma } from "@/lib/prisma";
import { generateAnswer } from "@/server/ai/generate-answer";
import { generateQueryEmbedding } from "@/server/ai/generate-query-embedding";
import { octokit as defaultOctokit } from "@/server/github/client";
import { EVENTS, inngest } from "@/server/inngest/client";
import { parseGitHubUrl, prepareQueryContext } from "@/server/utils";
import { components } from "@octokit/openapi-types";
import { Endpoints } from "@octokit/types";
import { inferProcedureBuilderResolverOptions, TRPCError } from "@trpc/server";
import { remark } from "remark";
import stripMarkdown from "strip-markdown";
import z from "zod";
import { protectedProcedure } from "../trpc";

const ANSWERS_PER_PAGE = 10;

type ProtectedProcedureContext = inferProcedureBuilderResolverOptions<
  typeof protectedProcedure
>["ctx"];

export class ProjectService {
  async createProject(
    ctx: ProtectedProcedureContext,
    input: z.infer<typeof NewProjectSchema>,
  ) {
    const { owner, repo } = parseGitHubUrl(input.github_url);
    const { data: repository } = await ctx.octokit.rest.repos.get({
      owner,
      repo,
    });

    // Check unique constraint on userId and github_id to prevent duplicate project creation
    const exists = await ctx.prisma.project.findFirst({
      where: {
        github_id: repository.id.toString(),
        userId: ctx.user.id,
      },
    });
    if (exists) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "This repository is already indexed. Please check in your Projects",
      });
    }

    const { data: branch } = await ctx.octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: repository.default_branch,
    });

    const latestCommitSha = branch.commit.sha;

    const project = await ctx.prisma.project.create({
      data: {
        github_id: repository.id.toString(),
        indexedCommitSha: latestCommitSha,
        name: input.name,
        userId: ctx.user.id,
        job: { create: {} },
      },
      select: {
        id: true,
        github_id: true,
        name: true,
        job: true,
      },
    });

    const {
      name,
      private: isPrivate,
      html_url,
      owner: repoOwnwer,
    } = repository;

    await inngest.send(
      EVENTS.PROJECT_CREATED.create({
        jobId: project.job!.id,
        projectId: project.id,
        repoUrl: html_url,
      }),
    );

    return {
      ...project,
      repo: name as string,
      isPrivate: isPrivate as boolean,
      url: html_url as string,
      owner: {
        username: repoOwnwer.login as string,
        avatar_url: repoOwnwer.avatar_url as string,
      },
    };
  }

  async getProjects(ctx: ProtectedProcedureContext) {
    const projects = await ctx.prisma.project.findMany({
      where: {
        userId: ctx.user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return projects;
  }

  async getProject(ctx: ProtectedProcedureContext, input: { id: string }) {
    const project = await ctx.prisma.project.findUnique({
      where: {
        id: input.id,
        userId: ctx.user.id,
      },
      select: {
        id: true,
        name: true,
        github_id: true,
        indexedCommitSha: true,
        createdAt: true,
        updatedAt: true,
        job: true,
      },
    });

    if (!project || !project.job) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid Request",
      });
    }

    const {
      data,
    }: { data: Endpoints["GET /repositories"]["response"]["data"][number] } =
      await ctx.octokit.request("GET /repositories/{id}?ref={ref}", {
        id: project.github_id,
        ref: project.indexedCommitSha,
      });

    const { name, private: isPrivate, html_url, owner } = data;

    return {
      ...project,
      job: undefined,
      jobStatus: project.job.status,
      repo: name as string,
      isPrivate: isPrivate as boolean,
      url: html_url as string,
      owner: {
        username: owner.login as string,
        avatar_url: owner.avatar_url as string,
      },
    };
  }

  async deleteProject(ctx: ProtectedProcedureContext, input: { id: string }) {
    await ctx.prisma.project.delete({
      where: {
        id: input.id,
        userId: ctx.user.id,
      },
    });

    return true;
  }

  async editProject(
    ctx: ProtectedProcedureContext,
    input: { id: string; name: string },
  ) {
    await ctx.prisma.project.update({
      where: {
        id: input.id,
        userId: ctx.user.id,
      },
      data: {
        name: input.name,
      },
    });

    return true;
  }

  async getJob(
    ctx: { prisma: typeof defaultPrisma },
    input: { projectId: string },
  ) {
    const job = await ctx.prisma.projectJob.findUnique({
      where: {
        projectId: input.projectId,
      },
      select: {
        id: true,
        status: true,
        progress: true,
      },
    });

    if (!job) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return job;
  }

  async askQuestion(
    ctx: ProtectedProcedureContext,
    input: { question: string; projectId: string },
  ) {
    const project = await ctx.prisma.project.findUnique({
      where: { id: input.projectId, userId: ctx.user.id },
    });
    if (!project) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid Request",
      });
    }

    type Repository = components["schemas"]["full-repository"];

    const { github_id, indexedCommitSha } = project;

    const { data: repository }: { data: Repository } =
      await ctx.octokit.request("GET /repositories/{id}", {
        id: github_id,
      });

    const username = repository.owner.login;
    const repo = repository.name;

    const embedding = await generateQueryEmbedding(input.question);

    const vectorString = `[${embedding.join(",")}]`;

    type VectorResult = {
      source: string;
      summary: string;
      similarity: number;
    };

    const results = await ctx.prisma.$queryRaw<VectorResult[]>`
      SELECT 
        "source", 
        "summary",
        1 - ("embedding" <=> ${vectorString}::vector) AS "similarity"
      FROM "repo_files"
      WHERE "projectId" = ${input.projectId}
        AND ("embedding" <=> ${vectorString}::vector) < 0.5
      ORDER BY "embedding" <=> ${vectorString}::vector ASC
      LIMIT 5;
      `;

    type GitHubFileContent = components["schemas"]["content-file"];

    const similar_files = await Promise.all(
      results.map(async (result) => {
        const { data: code }: { data: GitHubFileContent } =
          await ctx.octokit.request(
            "GET /repos/{owner}/{repo}/contents/{source}?ref={ref}",
            {
              owner: username,
              repo,
              source: result.source,
              ref: indexedCommitSha,
            },
          );
        return {
          source: result.source,
          code: Buffer.from(code.content, "base64").toString("utf-8"),
        };
      }),
    );

    const context = prepareQueryContext(similar_files);
    const generated = await generateAnswer(input.question, context);
    const saved = await ctx.prisma.answer.create({
      data: {
        title: generated.title,
        answer: generated.answer,
        question: input.question,
        projectId: input.projectId,
        sources: generated.files,
      },
    });

    return saved.id;
  }

  async getAnswer(
    ctx: { prisma: typeof defaultPrisma; octokit: typeof defaultOctokit },
    input: { id: string },
  ) {
    const answer = await ctx.prisma.answer.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!answer) return null;

    const project = await ctx.prisma.project.findUnique({
      where: { id: answer.projectId },
    });

    const sources = await Promise.all(
      answer.sources.map(async (source) => {
        const { data }: { data: components["schemas"]["content-file"] } =
          await ctx.octokit.request(
            "GET /repositories/{id}/contents/{path}?ref={ref}",
            {
              id: project!.github_id,
              path: source,
              ref: project?.indexedCommitSha,
            },
          );

        if (data && data.type === "file") {
          const base64Content = data.content;
          const decodedText = Buffer.from(base64Content, "base64").toString(
            "utf-8",
          );

          return { source, contents: decodedText };
        }

        return { source, contents: null };
      }),
    );

    return {
      ...answer,
      sources,
    };
  }

  async getAnswers(
    ctx: ProtectedProcedureContext,
    input: { projectId: string; cursor?: number | null },
  ) {
    const page = input.cursor ?? 1;

    const answers = await ctx.prisma.answer.findMany({
      where: {
        projectId: input.projectId,
      },
      select: {
        id: true,
        question: true,
        title: true,
        answer: true,
        createdAt: true,
      },
    });

    const r = await Promise.all(
      answers.map(async (ans) => {
        const file = await remark().use(stripMarkdown).process(ans.answer);
        return {
          ...ans,
          answer: String(file).trim().slice(0, 100) + "...",
        };
      }),
    );

    return {
      answers: r,
      nextCursor: answers.length === ANSWERS_PER_PAGE ? page + 1 : undefined,
    };
  }
}

export const projectService = new ProjectService();
