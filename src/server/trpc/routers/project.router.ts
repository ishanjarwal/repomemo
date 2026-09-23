import { NewProjectSchema } from "@/features/project/schema";
import { EVENTS, inngest } from "@/server/inngest/client";
import { parseGitHubUrl } from "@/server/utils";
import { TRPCError } from "@trpc/server";
import { RequestError } from "octokit";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(NewProjectSchema)
    .mutation(async ({ ctx, input }) => {
      // 1. validate the github url
      try {
        const { owner, repo } = parseGitHubUrl(input.github_url);
        const { data } = await ctx.octokit.rest.repos.get({
          owner,
          repo,
        });

        // TODO : consider unique constraint on github_id and userId because deletion just sets the deletedAt and doesn't actually delete the project. So if a user deletes a project, and tries to create a new project but for the same repo, it throws db error.

        const project = await ctx.prisma.project.create({
          data: {
            github_id: data.id.toString(),
            name: input.name,
            userId: ctx.user_id,
            job: { create: {} },
          },
          select: {
            id: true,
            github_id: true,
            name: true,
            job: true,
          },
        });

        const response = await ctx.octokit.request(`GET /repositories/{id}`, {
          id: project.github_id,
        });

        if (response.status !== 200) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid Request",
          });
        }

        const {
          name,
          private: isPrivate,
          html_url,
          owner: repoOwnwer,
        } = response.data;

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
      } catch (error: unknown) {
        console.log(error);
        if (error instanceof RequestError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid Github Repo",
          });
        } else if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong",
          });
        }
      }
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        userId: ctx.user_id,
        deletedAt: null,
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
  }),

  getProject: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.user_id,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          github_id: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Request",
        });
      }

      const response = await ctx.octokit.request("GET /repositories/{id}", {
        id: project.github_id,
      });

      if (response.status !== 200) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Request",
        });
      }

      const { name, private: isPrivate, html_url, owner } = response.data;

      return {
        ...project,
        repo: name as string,
        isPrivate: isPrivate as boolean,
        url: html_url as string,
        owner: {
          username: owner.login as string,
          avatar_url: owner.avatar_url as string,
        },
      };
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.update({
        where: {
          id: input.id,
          userId: ctx.user_id,
          deletedAt: null,
        },
        data: {
          deletedAt: { set: new Date() },
        },
      });

      return true;
    }),

  getJob: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
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
    }),
});
