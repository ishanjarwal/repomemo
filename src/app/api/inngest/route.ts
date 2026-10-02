import { inngest } from "@/server/inngest/client";
import { createProjectJob, sendMail } from "@/server/inngest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [createProjectJob, sendMail],
});
