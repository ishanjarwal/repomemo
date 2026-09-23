import { prisma } from "@/lib/prisma";
import { repoContentLoader } from "../github/repo-content-loader";
import { EVENTS, inngest } from "./client";
import { generateRepoContentSummary } from "../ai/generate-repo-files-summary";
import { generateRepoFilesSummaryEmbeddings } from "../ai/generate-repo-file-summary-embeddings";
import { chunkArray } from "../utils";
import { Document } from "@langchain/core/documents";

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
