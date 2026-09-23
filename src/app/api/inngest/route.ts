import { inngest } from "@/server/inngest/client";
import { createProjectJob } from "@/server/inngest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [createProjectJob],
});
