import { eventType, Inngest, staticSchema } from "inngest";

export const EVENTS = {
  PROJECT_CREATED: eventType("app/project.created", {
    schema: staticSchema<{
      jobId: string;
      projectId: string;
      repoUrl: string;
    }>(),
  }),
};

export const inngest = new Inngest({ id: "repomemo", isDev: true });
