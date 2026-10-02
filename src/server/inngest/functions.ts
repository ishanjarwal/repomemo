import { resend } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { Document } from "@langchain/core/documents";
import { generateRepoFilesSummaryEmbeddings } from "../ai/generate-repo-file-summary-embeddings";
import { generateRepoContentSummary } from "../ai/generate-repo-files-summary";
import { repoContentLoader } from "../github/repo-content-loader";
import { chunkArray } from "../utils";
import { EVENTS, inngest } from "./client";
import { transporter } from "@/lib/nodemailer";

export const createProjectJob = inngest.createFunction(
  { id: "create-project", triggers: [EVENTS.PROJECT_CREATED] },
  async ({ event, step, logger }) => {
    await step.run("update-job-status-fetching-repo", async () => {
      await prisma.projectJob.update({
        where: { id: event.data.jobId },
        data: {
          status: "fetching_repo",
          progress: 25,
        },
      });
    });

    const chunkedDocs = await step.run("load-repo-contents", async () => {
      const docs = await repoContentLoader(event.data.repoUrl);
      const chunked = chunkArray<Document>(docs, 8);
      return chunked;
    });

    await step.run("update-job-status-indexing-files", async () => {
      await prisma.projectJob.update({
        where: { id: event.data.jobId },
        data: {
          status: "indexing_files",
          progress: 50,
        },
      });
    });

    const summaries = await step.run("generate-file-summaries", async () => {
      return (
        await Promise.all(
          chunkedDocs.map(async (doc) => {
            const summary = await generateRepoContentSummary(doc);
            return summary;
          }),
        )
      ).flat();
    });

    await step.run("update-job-status-create-embeddings", async () => {
      await prisma.projectJob.update({
        where: { id: event.data.jobId },
        data: {
          status: "creating_embeddings",
          progress: 75,
        },
      });
    });

    const embeddings = await step.run(
      "generate-file-summary-embeddings",
      async () => {
        const embeddings = await generateRepoFilesSummaryEmbeddings(summaries);
        return embeddings;
      },
    );

    await step.run("save-embeddings-to-db", async () => {
      await prisma.$transaction(
        embeddings.map(
          (item) =>
            prisma.$executeRaw`
      INSERT INTO "repo_files" ("id", "source", "summary", "embedding", "projectId")
      VALUES (
        ${crypto.randomUUID()},
        ${item.source},
        ${item.summary},
        ${`[${item.embedding.join(",")}]`}::vector,
        ${event.data.projectId}
      )
    `,
        ),
      );
    });

    await step.run("update-job-status-ready", async () => {
      await prisma.projectJob.update({
        where: { id: event.data.jobId },
        data: {
          status: "ready",
          progress: 100,
        },
      });
    });
  },
);

export const sendMail = inngest.createFunction(
  {
    id: "send-mail",
    triggers: [EVENTS.SEND_MAIL], // all events that trigger mail
  },
  async ({ step, event }) => {
    const { from, to, subject, html } = event.data;
    await step.run("send", async () => {
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      // const { error } = await resend.emails.send({
      //   from,
      //   to,
      //   subject,
      //   html,
      // });
      // if (error) {
      //   console.log(`[Mail Error] : ${error.message}`);
      // }
    });
  },
);
