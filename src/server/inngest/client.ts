import { eventType, Inngest, staticSchema } from "inngest";

export const EVENTS = {
  PROJECT_CREATED: eventType("app/project.created", {
    schema: staticSchema<{
      jobId: string;
      projectId: string;
      repoUrl: string;
    }>(),
  }),
  SEND_MAIL: eventType("app/send-mail", {
    schema: staticSchema<{
      from: string;
      to: string;
      subject: string;
      html: string;
    }>(),
  }),
};

export const inngest = new Inngest({ id: "repomemo", isDev: true });
