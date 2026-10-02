import { NewProjectSchema, QuestionSchema } from "@/features/project/schema";
import z from "zod";
import { projectService } from "../services/project.service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(NewProjectSchema)
    .mutation(async ({ ctx, input }) => {
      return projectService.createProject(ctx, input);
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return projectService.getProjects(ctx);
  }),

  getProject: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return projectService.getProject(ctx, input);
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return projectService.deleteProject(ctx, input);
    }),

  editProject: protectedProcedure
    .input(
      z.object({ id: z.string().min(1), name: NewProjectSchema.shape.name }),
    )
    .mutation(async ({ ctx, input }) => {
      return projectService.editProject(ctx, input);
    }),

  getJob: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return projectService.getJob(ctx, input);
    }),

  askQuestion: protectedProcedure
    .input(z.object({ ...QuestionSchema.shape, projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return projectService.askQuestion(ctx, input);
    }),

  getAnswer: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return projectService.getAnswer(ctx, input);
    }),

  getAnswers: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return projectService.getAnswers(ctx, input);
    }),
});
