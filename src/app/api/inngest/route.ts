import { inngest } from "@/server/inngest/client";
import {
  cleanupOrphanedProjectCreateSessions,
  createProjectJob,
  reindexProjectJob,
  sendMail,
} from "@/server/inngest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    createProjectJob,
    reindexProjectJob,
    sendMail,
    cleanupOrphanedProjectCreateSessions,
  ],
});
