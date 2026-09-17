import { NewProjectSchema } from "@/features/project/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(NewProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          ...input,
          userId: ctx.user_id,
        },
      });

      return project;
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
        github_url: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return projects;
  }),
});
