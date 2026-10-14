import { resend } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { Document } from "@langchain/core/documents";
import { generateRepoFilesSummaryEmbeddings } from "../ai/generate-repo-file-summary-embeddings";
import { generateRepoContentSummary } from "../ai/generate-repo-files-summary";
import { repoContentLoader } from "../github/repo-content-loader";
import { chunkArray, parseGitHubUrl } from "../utils";
import { EVENTS, inngest } from "./client";
import { transporter } from "@/lib/nodemailer";
import { cron } from "inngest";
import { generateSuggestedQueries } from "../ai/generate-suggested-queries";
import { decryptSafe } from "../crypto";
import { getOctokit } from "../github/client";
import {
  fetchFileContentAtSha,
  getChangedFilesBetweenCommits,
} from "../github/compare";

export const createProjectJob = inngest.createFunction(
  {
    id: "create-project",
    triggers: [EVENTS.PROJECT_CREATED],
    onFailure: async ({ event }) => {
      const jobId = event.data.event.data.jobId;
      if (jobId) {
        await prisma.projectJob.update({
          where: { id: jobId },
          data: {
            status: "failed",
          },
        });
      }
    },
  },
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
      const project = await prisma.project.findUnique({
        where: { id: event.data.projectId },
        select: { personalAccessToken: true },
      });
      const token = decryptSafe(project?.personalAccessToken) || undefined;
      const docs = await repoContentLoader(
        event.data.repoUrl,
        event.data.sha,
        token,
      );
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

    await step.run("generate-suggested-queries", async () => {
      const project = await prisma.project.findUnique({
        where: { id: event.data.projectId },
        select: { personalAccessToken: true },
      });
      const token = decryptSafe(project?.personalAccessToken) || undefined;
      const suggestedQueries = await generateSuggestedQueries(
        event.data.repoUrl,
        event.data.sha,
        token,
      );

      await prisma.project.update({
        where: { id: event.data.projectId },
        data: { suggestedQueries },
      });
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

export const cleanupOrphanedProjectCreateSessions = inngest.createFunction(
  {
    id: "cleanup-orphaned-project-create-sessions",
    //every day at midnight)
    triggers: [cron("0 0 * * *")],
  },
  async ({ step }) => {
    const result = await step.run(
      "initiate-delete-orphaned-project-create-sessions",
      async () => {
        const deleted = await prisma.projectCreateSession.deleteMany({
          where: {
            createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 1 day
          },
        });

        return { count: deleted.count };
      },
    );

    return {
      message: `Successfully deleted ${result.count} orphaned projectCreateSession documents.`,
    };
  },
);

export const reindexProjectJob = inngest.createFunction(
  {
    id: "reindex-project",
    triggers: [EVENTS.PROJECT_REINDEX],
    onFailure: async ({ event }) => {
      const jobId = event.data.event.data.jobId;
      if (jobId) {
        await prisma.projectJob.update({
          where: { id: jobId },
          data: {
            status: "failed",
          },
        });
      }
    },
  },
  async ({ event, step }) => {
    await step.run("update-job-status-reindexing", async () => {
      await prisma.projectJob.update({
        where: { id: event.data.jobId },
        data: {
          status: "reindexing",
          progress: 10,
        },
      });
    });

    const changedFiles = await step.run("fetch-changed-files", async () => {
      const project = await prisma.project.findUnique({
        where: { id: event.data.projectId },
        select: { personalAccessToken: true },
      });
      const token = decryptSafe(project?.personalAccessToken) || undefined;
      const octokit = getOctokit(token);

      const parsed = parseGitHubUrl(event.data.repoUrl);
      if (!parsed) throw new Error("Invalid repository URL");
      const { owner, repo } = parsed;

      return await getChangedFilesBetweenCommits(
        octokit,
        owner,
        repo,
        event.data.baseSha,
        event.data.targetSha,
      );
    });

    await step.run("clean-stale-embeddings", async () => {
      for (const file of changedFiles) {
        if (file.status === "removed") {
          await prisma.repoFile.deleteMany({
            where: {
              projectId: event.data.projectId,
              source: file.filename,
            },
          });
        } else if (file.status === "renamed") {
          if (file.previous_filename) {
            await prisma.repoFile.deleteMany({
              where: {
                projectId: event.data.projectId,
                source: file.previous_filename,
              },
            });
          }
          await prisma.repoFile.deleteMany({
            where: {
              projectId: event.data.projectId,
              source: file.filename,
            },
          });
        } else {
          // "modified" or "added"
          await prisma.repoFile.deleteMany({
            where: {
              projectId: event.data.projectId,
              source: file.filename,
            },
          });
        }
      }
    });

    const chunkedDocs = await step.run("load-changed-file-contents", async () => {
      const project = await prisma.project.findUnique({
        where: { id: event.data.projectId },
        select: { personalAccessToken: true },
      });
      const token = decryptSafe(project?.personalAccessToken) || undefined;
      const octokit = getOctokit(token);

      const parsed = parseGitHubUrl(event.data.repoUrl);
      if (!parsed) throw new Error("Invalid repository URL");
      const { owner, repo } = parsed;

      const filesToFetch = changedFiles.filter((f) => f.status !== "removed");
      const docs: Document[] = [];

      for (const file of filesToFetch) {
        const content = await fetchFileContentAtSha(
          octokit,
          owner,
          repo,
          file.filename,
          event.data.targetSha,
        );
        if (content !== null && content.length > 0) {
          docs.push(
            new Document({
              pageContent: content,
              metadata: { source: file.filename },
            }),
          );
        }
      }

      return chunkArray<Document>(docs, 8);
    });

    if (chunkedDocs.length > 0) {
      await step.run("update-job-progress-summaries", async () => {
        await prisma.projectJob.update({
          where: { id: event.data.jobId },
          data: { progress: 40 },
        });
      });

      const summaries = await step.run("generate-file-summaries", async () => {
        return (
          await Promise.all(
            chunkedDocs.map(async (doc) => {
              return await generateRepoContentSummary(doc);
            }),
          )
        ).flat();
      });

      await step.run("update-job-progress-embeddings", async () => {
        await prisma.projectJob.update({
          where: { id: event.data.jobId },
          data: { progress: 70 },
        });
      });

      const embeddings = await step.run(
        "generate-file-summary-embeddings",
        async () => {
          return await generateRepoFilesSummaryEmbeddings(summaries);
        },
      );

      await step.run("save-embeddings-to-db", async () => {
        if (embeddings.length > 0) {
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
        }
      });
    }

    await step.run("generate-suggested-queries", async () => {
      const project = await prisma.project.findUnique({
        where: { id: event.data.projectId },
        select: { personalAccessToken: true },
      });
      const token = decryptSafe(project?.personalAccessToken) || undefined;
      const suggestedQueries = await generateSuggestedQueries(
        event.data.repoUrl,
        event.data.targetSha,
        token,
      );

      await prisma.project.update({
        where: { id: event.data.projectId },
        data: { suggestedQueries },
      });
    });

    await step.run("update-job-status-ready", async () => {
      await prisma.project.update({
        where: { id: event.data.projectId },
        data: {
          indexedCommitSha: event.data.targetSha,
        },
      });

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
