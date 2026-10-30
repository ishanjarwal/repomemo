import { env } from "@/env";
import { eventType, Inngest, staticSchema } from "inngest";

export const EVENTS = {
  PROJECT_CREATED: eventType("app/project.created", {
    schema: staticSchema<{
      jobId: string;
      projectId: string;
      repoUrl: string;
      sha: string;
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
  PROJECT_REINDEX: eventType("app/project.reindex", {
    schema: staticSchema<{
      jobId: string;
      projectId: string;
      repoUrl: string;
      baseSha: string;
      targetSha: string;
    }>(),
  }),
};

export const inngest = new Inngest({
  id: "repomemo",
  isDev: env.NODE_ENV === "development" ? true : false,
  baseUrl: env.INNGEST_BASE_URL,
  eventKey: env.INNGEST_EVENT_KEY,
  signingKey: env.INNGEST_SIGNING_KEY,
});
