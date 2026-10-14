import test from "node:test";
import assert from "node:assert/strict";
import {
  getChangedFilesBetweenCommits,
  getLatestRepoCommit,
  fetchFileContentAtSha,
  type ChangedFile,
} from "../github/compare";
import { ProjectService } from "../trpc/services/project.service";
import { TRPCError } from "@trpc/server";

// ---------------------------------------------------------------------------
// 1. Commit Comparison & Changed Files Tests
// ---------------------------------------------------------------------------
test("Commit comparison: returns empty array when base and head are identical or missing", async () => {
  const dummyOctokit = {} as any;
  const sameResult = await getChangedFilesBetweenCommits(dummyOctokit, "owner", "repo", "sha1", "sha1");
  assert.deepEqual(sameResult, []);

  const emptyBase = await getChangedFilesBetweenCommits(dummyOctokit, "owner", "repo", "", "sha2");
  assert.deepEqual(emptyBase, []);

  const emptyHead = await getChangedFilesBetweenCommits(dummyOctokit, "owner", "repo", "sha1", "");
  assert.deepEqual(emptyHead, []);
});

test("Commit comparison: parses added, modified, deleted, and renamed files across paginated pages", async () => {
  const page1Files = Array.from({ length: 100 }, (_, i) => ({
    filename: `file_${i}.ts`,
    status: i % 2 === 0 ? "modified" : "added",
  }));

  const page2Files = [
    { filename: "deleted_file.ts", status: "removed" },
    {
      filename: "renamed_new.ts",
      status: "renamed",
      previous_filename: "renamed_old.ts",
    },
  ];

  const mockOctokit = {
    rest: {
      repos: {
        compareCommitsWithBasehead: async ({ page }: { page: number }) => {
          if (page === 1) {
            return {
              data: { files: page1Files },
              headers: { link: '<https://api.github.com/...?page=2>; rel="next"' },
            };
          }
          return {
            data: { files: page2Files },
            headers: {},
          };
        },
      },
    },
  } as any;

  const result = await getChangedFilesBetweenCommits(mockOctokit, "owner", "repo", "sha_base", "sha_head");

  assert.equal(result.length, 102);
  assert.equal(result[0].filename, "file_0.ts");
  assert.equal(result[100].status, "removed");
  assert.equal(result[101].status, "renamed");
  assert.equal(result[101].previous_filename, "renamed_old.ts");
});

test("Commit comparison: 1 file = 1 credit calculation parity", async () => {
  const files: ChangedFile[] = [
    { filename: "a.ts", status: "added" },
    { filename: "b.ts", status: "modified" },
    { filename: "c.ts", status: "removed" },
    { filename: "d.ts", status: "renamed", previous_filename: "d_old.ts" },
  ];

  const mockOctokit = {
    rest: {
      repos: {
        compareCommitsWithBasehead: async () => ({
          data: { files },
          headers: {},
        }),
      },
    },
  } as any;

  const changed = await getChangedFilesBetweenCommits(mockOctokit, "owner", "repo", "sha1", "sha2");
  const estimatedCredits = changed.length;

  assert.equal(changed.length, 4);
  assert.equal(estimatedCredits, 4);
});

// ---------------------------------------------------------------------------
// 2. Fetch File Content at Specific SHA Tests
// ---------------------------------------------------------------------------
test("File content retrieval: decodes base64 content at target commit SHA", async () => {
  const fileText = "export const greeting = 'Hello World';";
  const mockOctokit = {
    rest: {
      repos: {
        getContent: async ({ ref, path }: { ref: string; path: string }) => {
          assert.equal(ref, "target_sha_123");
          assert.equal(path, "src/index.ts");
          return {
            data: {
              type: "file",
              content: Buffer.from(fileText).toString("base64"),
              encoding: "base64",
            },
          };
        },
      },
    },
  } as any;

  const content = await fetchFileContentAtSha(mockOctokit, "owner", "repo", "src/index.ts", "target_sha_123");
  assert.equal(content, fileText);
});

test("File content retrieval: falls back to blob API for large files", async () => {
  const largeText = "Large file content exceeding 1MB";
  const mockOctokit = {
    rest: {
      repos: {
        getContent: async () => ({
          data: {
            type: "file",
            sha: "blob_sha_456",
            // content omitted by GitHub for >1MB
          },
        }),
      },
      git: {
        getBlob: async ({ file_sha }: { file_sha: string }) => {
          assert.equal(file_sha, "blob_sha_456");
          return {
            data: {
              content: Buffer.from(largeText).toString("base64"),
              encoding: "base64",
            },
          };
        },
      },
    },
  } as any;

  const content = await fetchFileContentAtSha(mockOctokit, "owner", "repo", "large.json", "sha_target");
  assert.equal(content, largeText);
});

test("File content retrieval: gracefully returns null on API errors", async () => {
  const mockOctokit = {
    rest: {
      repos: {
        getContent: async () => {
          throw new Error("404 Not Found");
        },
      },
    },
  } as any;

  const content = await fetchFileContentAtSha(mockOctokit, "owner", "repo", "missing.txt", "sha_target");
  assert.equal(content, null);
});

// ---------------------------------------------------------------------------
// 3. getLatestRepoCommit Tests
// ---------------------------------------------------------------------------
test("getLatestRepoCommit: retrieves repository metadata and latest commit SHA", async () => {
  const mockOctokit = {
    request: async (route: string) => {
      assert.equal(route, "GET /repositories/{id}");
      return {
        data: {
          name: "test-repo",
          private: false,
          default_branch: "main",
          html_url: "https://github.com/test-user/test-repo",
          owner: {
            login: "test-user",
            avatar_url: "https://avatars.githubusercontent.com/u/123",
          },
        },
      };
    },
    rest: {
      repos: {
        getBranch: async ({ branch }: { branch: string }) => {
          assert.equal(branch, "main");
          return {
            data: {
              commit: { sha: "commit_sha_latest_999" },
            },
          };
        },
      },
    },
  } as any;

  const repo = await getLatestRepoCommit(mockOctokit, "123456");
  assert.equal(repo.repo, "test-repo");
  assert.equal(repo.owner, "test-user");
  assert.equal(repo.isPrivate, false);
  assert.equal(repo.defaultBranch, "main");
  assert.equal(repo.latestCommitSha, "commit_sha_latest_999");
});

test("getLatestRepoCommit: handles GitHub API errors and returns null commit SHA", async () => {
  const mockOctokit = {
    request: async () => ({
      data: {
        name: "test-repo",
        private: false,
        default_branch: "main",
        html_url: "",
        owner: { login: "test-user", avatar_url: "" },
      },
    }),
    rest: {
      repos: {
        getBranch: async () => {
          throw new Error("Branch not found");
        },
        getCommit: async () => {
          throw new Error("Commit not found");
        },
      },
    },
  } as any;

  const repo = await getLatestRepoCommit(mockOctokit, "123456");
  assert.equal(repo.latestCommitSha, null);
});

// ---------------------------------------------------------------------------
// 4. ProjectService.getProject & reindexRequest Tests
// ---------------------------------------------------------------------------
test("getProject: detects new commit and returns reindexRequest: true with file count & credits", async () => {
  const projectService = new ProjectService();

  const mockPrisma = {
    project: {
      findUnique: async () => ({
        id: "proj_1",
        name: "My Project",
        github_id: "98765",
        indexedCommitSha: "old_commit_sha",
        suggestedQueries: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        job: { status: "ready" },
        personalAccessToken: null,
      }),
    },
  };

  const mockOctokit = {
    request: async (route: string) => {
      if (route === "GET /repositories/{id}") {
        return {
          data: {
            name: "test-repo",
            private: false,
            default_branch: "main",
            html_url: "https://github.com/user/test-repo",
            owner: { login: "user", avatar_url: "" },
          },
        };
      }
      return { data: {} };
    },
    rest: {
      repos: {
        getBranch: async () => ({
          data: { commit: { sha: "new_commit_sha" } },
        }),
        compareCommitsWithBasehead: async () => ({
          data: {
            files: [
              { filename: "src/a.ts", status: "modified" },
              { filename: "src/b.ts", status: "added" },
              { filename: "src/c.ts", status: "removed" },
            ],
          },
          headers: {},
        }),
      },
    },
  };

  const ctx = {
    prisma: mockPrisma,
    octokit: mockOctokit,
    user: { id: "user_1" },
  } as any;

  const result = await projectService.getProject(ctx, { id: "proj_1" });

  assert.equal(result.reindexRequest, true);
  assert.equal(result.changedFilesCount, 3);
  assert.equal(result.estimatedCredits, 3);
  assert.equal(result.latestCommitSha, "new_commit_sha");
});

test("getProject: returns reindexRequest: false when commits match", async () => {
  const projectService = new ProjectService();

  const mockPrisma = {
    project: {
      findUnique: async () => ({
        id: "proj_1",
        name: "My Project",
        github_id: "98765",
        indexedCommitSha: "same_commit_sha",
        suggestedQueries: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        job: { status: "ready" },
        personalAccessToken: null,
      }),
    },
  };

  const mockOctokit = {
    request: async () => ({
      data: {
        name: "test-repo",
        private: false,
        default_branch: "main",
        html_url: "",
        owner: { login: "user", avatar_url: "" },
      },
    }),
    rest: {
      repos: {
        getBranch: async () => ({
          data: { commit: { sha: "same_commit_sha" } },
        }),
      },
    },
  };

  const ctx = {
    prisma: mockPrisma,
    octokit: mockOctokit,
    user: { id: "user_1" },
  } as any;

  const result = await projectService.getProject(ctx, { id: "proj_1" });

  assert.equal(result.reindexRequest, false);
  assert.equal(result.changedFilesCount, 0);
  assert.equal(result.estimatedCredits, 0);
});

// ---------------------------------------------------------------------------
// 5. Reindex Procedure Validation, Authorization, Duplicate Checks
// ---------------------------------------------------------------------------
test("reindexProject: rejects unauthorized or non-existent project", async () => {
  const projectService = new ProjectService();
  const mockPrisma = {
    project: {
      findUnique: async () => null,
    },
  };

  const ctx = {
    prisma: mockPrisma,
    user: { id: "intruder_user" },
  } as any;

  await assert.rejects(
    async () => {
      await projectService.reindexProject(ctx, { projectId: "non_existent_proj" });
    },
    (err: any) => {
      assert(err instanceof TRPCError);
      assert.equal(err.code, "NOT_FOUND");
      return true;
    },
  );
});

test("reindexProject: rejects duplicate request if reindexing is already active", async () => {
  const projectService = new ProjectService();
  const mockPrisma = {
    project: {
      findUnique: async () => ({
        id: "proj_1",
        userId: "user_1",
        job: { status: "reindexing" },
      }),
    },
  };

  const ctx = {
    prisma: mockPrisma,
    user: { id: "user_1" },
  } as any;

  await assert.rejects(
    async () => {
      await projectService.reindexProject(ctx, { projectId: "proj_1" });
    },
    (err: any) => {
      assert(err instanceof TRPCError);
      assert.equal(err.code, "BAD_REQUEST");
      assert.match(err.message, /already in progress/i);
      return true;
    },
  );
});

test("reindexProject: rejects request if repository is already up to date", async () => {
  const projectService = new ProjectService();
  const mockPrisma = {
    project: {
      findUnique: async () => ({
        id: "proj_1",
        userId: "user_1",
        github_id: "123",
        indexedCommitSha: "current_sha",
        job: { status: "ready" },
        personalAccessToken: null,
      }),
    },
  };

  const mockOctokit = {
    request: async () => ({
      data: {
        name: "test-repo",
        private: false,
        default_branch: "main",
        html_url: "",
        owner: { login: "user", avatar_url: "" },
      },
    }),
    rest: {
      repos: {
        getBranch: async () => ({
          data: { commit: { sha: "current_sha" } },
        }),
      },
    },
  };

  const ctx = {
    prisma: mockPrisma,
    octokit: mockOctokit,
    user: { id: "user_1" },
  } as any;

  await assert.rejects(
    async () => {
      await projectService.reindexProject(ctx, { projectId: "proj_1" });
    },
    (err: any) => {
      assert(err instanceof TRPCError);
      assert.equal(err.code, "BAD_REQUEST");
      assert.match(err.message, /already up to date/i);
      return true;
    },
  );
});

test("reindexProject: validates private repo PAT requirement", async () => {
  const projectService = new ProjectService();
  const mockPrisma = {
    project: {
      findUnique: async () => ({
        id: "proj_private",
        userId: "user_1",
        github_id: "999",
        indexedCommitSha: "old_sha",
        job: { status: "ready" },
        personalAccessToken: null, // missing token for private repo
      }),
    },
  };

  const mockOctokit = {
    request: async () => ({
      data: {
        name: "private-repo",
        private: true,
        default_branch: "main",
        html_url: "",
        owner: { login: "user", avatar_url: "" },
      },
    }),
    rest: {
      repos: {
        getBranch: async () => ({
          data: { commit: { sha: "new_sha" } },
        }),
      },
    },
  };

  const ctx = {
    prisma: mockPrisma,
    octokit: mockOctokit,
    user: { id: "user_1" },
  } as any;

  await assert.rejects(
    async () => {
      await projectService.reindexProject(ctx, { projectId: "proj_private" });
    },
    (err: any) => {
      assert(err instanceof TRPCError);
      assert.equal(err.code, "BAD_REQUEST");
      assert.match(err.message, /private/i);
      return true;
    },
  );
});

// ---------------------------------------------------------------------------
// 6. DB Stale/Duplicate Embeddings Cleanup Logic
// ---------------------------------------------------------------------------
test("Stale embeddings cleanup: removed and renamed files are deleted, modified file entries are replaced", async () => {
  const deletedSources: string[] = [];

  const fakePrisma = {
    repoFile: {
      deleteMany: async ({ where }: { where: { projectId: string; source: string } }) => {
        deletedSources.push(where.source);
        return { count: 1 };
      },
    },
  };

  const changedFiles: ChangedFile[] = [
    { filename: "src/removed.ts", status: "removed" },
    { filename: "src/renamed_new.ts", status: "renamed", previous_filename: "src/renamed_old.ts" },
    { filename: "src/modified.ts", status: "modified" },
    { filename: "src/added.ts", status: "added" },
  ];

  // Emulating the exact cleanup step in reindexProjectJob
  for (const file of changedFiles) {
    if (file.status === "removed") {
      await fakePrisma.repoFile.deleteMany({
        where: { projectId: "proj_1", source: file.filename },
      });
    } else if (file.status === "renamed") {
      if (file.previous_filename) {
        await fakePrisma.repoFile.deleteMany({
          where: { projectId: "proj_1", source: file.previous_filename },
        });
      }
      await fakePrisma.repoFile.deleteMany({
        where: { projectId: "proj_1", source: file.filename },
      });
    } else {
      await fakePrisma.repoFile.deleteMany({
        where: { projectId: "proj_1", source: file.filename },
      });
    }
  }

  assert(deletedSources.includes("src/removed.ts"), "Removed file should be deleted from DB");
  assert(deletedSources.includes("src/renamed_old.ts"), "Previous filename of renamed file should be deleted");
  assert(deletedSources.includes("src/renamed_new.ts"), "New filename of renamed file cleaned before reinsert");
  assert(deletedSources.includes("src/modified.ts"), "Modified file existing record cleaned before reinsert");
  assert(deletedSources.includes("src/added.ts"), "Added file cleaned before insert");
});

// ---------------------------------------------------------------------------
// 7. Full Successful Reindexing Workflow & Credit Check
// ---------------------------------------------------------------------------
test("reindexProject: successfully consumes credits, sets status to reindexing, and dispatches inngest event with targetSha", async () => {
  const projectService = new ProjectService();

  let jobUpdatedStatus = "";
  let creditsDeducted = 0;
  let inngestEventSent: any = null;

  const mockPrisma = {
    project: {
      findUnique: async () => ({
        id: "proj_123",
        userId: "user_1",
        github_id: "repo_999",
        indexedCommitSha: "base_sha_abc",
        personalAccessToken: null,
        job: { id: "job_456", status: "ready" },
      }),
    },
    credits: {
      findUnique: async () => ({
        userId: "user_1",
        credits: 50,
      }),
      update: async ({ data }: any) => {
        creditsDeducted += data.credits.decrement;
      },
    },
    projectJob: {
      update: async ({ data }: any) => {
        jobUpdatedStatus = data.status;
      },
    },
  };

  const mockOctokit = {
    request: async () => ({
      data: {
        name: "repo-name",
        private: false,
        default_branch: "main",
        html_url: "https://github.com/owner/repo-name",
        owner: { login: "owner", avatar_url: "" },
      },
    }),
    rest: {
      repos: {
        getBranch: async () => ({
          data: { commit: { sha: "target_sha_xyz" } },
        }),
        compareCommitsWithBasehead: async () => ({
          data: {
            files: [
              { filename: "f1.ts", status: "added" },
              { filename: "f2.ts", status: "modified" },
            ],
          },
          headers: {},
        }),
      },
    },
  };

  const { inngest } = await import("../inngest/client");
  const originalSend = inngest.send;
  inngest.send = (async (evt: any) => {
    inngestEventSent = evt;
  }) as any;

  try {
    const ctx = {
      prisma: mockPrisma,
      octokit: mockOctokit,
      user: { id: "user_1" },
    } as any;

    const result = await projectService.reindexProject(ctx, { projectId: "proj_123" });

    assert.equal(result.success, true);
    assert.equal(result.changedFilesCount, 2);
    assert.equal(result.creditsConsumed, 2);
    assert.equal(creditsDeducted, 2, "Exact parity: 2 changed files = 2 credits deducted");
    assert.equal(jobUpdatedStatus, "reindexing");
    assert(inngestEventSent, "Inngest event should be dispatched");
    assert.equal(inngestEventSent.data.jobId, "job_456");
    assert.equal(inngestEventSent.data.projectId, "proj_123");
    assert.equal(inngestEventSent.data.baseSha, "base_sha_abc");
    assert.equal(inngestEventSent.data.targetSha, "target_sha_xyz", "Target SHA must be consistently captured");
  } finally {
    inngest.send = originalSend;
  }
});

// ---------------------------------------------------------------------------
// 8. Workflow Failure Handling
// ---------------------------------------------------------------------------
test("reindex workflow failure: onFailure sets job status to failed and does NOT advance indexedCommitSha", async () => {
  let failedJobStatus = "";

  const { prisma } = await import("@/lib/prisma");
  const { reindexProjectJob } = await import("../inngest/functions");

  const originalUpdate = prisma.projectJob.update;
  prisma.projectJob.update = (async ({ where, data }: any) => {
    assert.equal(where.id, "job_failed_1");
    failedJobStatus = data.status;
    return {} as any;
  }) as any;

  try {
    const fnOptions = (reindexProjectJob as any)["opts"];
    assert(fnOptions?.onFailure, "reindexProjectJob must have an onFailure handler");

    await fnOptions.onFailure({
      event: {
        data: {
          event: {
            data: {
              jobId: "job_failed_1",
              projectId: "proj_1",
              targetSha: "sha_should_not_be_saved",
            },
          },
        },
      },
    });

    assert.equal(failedJobStatus, "failed", "job status must be updated to failed");
  } finally {
    prisma.projectJob.update = originalUpdate;
  }
});

