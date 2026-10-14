import { Octokit } from "octokit";

export interface ChangedFile {
  filename: string;
  status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged" | string;
  previous_filename?: string;
}

export interface RepoDetails {
  repo: string;
  owner: string;
  isPrivate: boolean;
  defaultBranch: string;
  latestCommitSha: string | null;
  htmlUrl: string;
  avatarUrl: string;
}

/**
 * Fetches repository details and latest commit SHA for the default branch by GitHub repository ID.
 * Returns null for latestCommitSha if not found or on GitHub API error.
 */
export async function getLatestRepoCommit(
  octokit: Octokit,
  githubId: string,
): Promise<RepoDetails> {
  const { data } = await octokit.request("GET /repositories/{id}", {
    id: githubId,
  });

  const repo = data.name as string;
  const owner = data.owner.login as string;
  const isPrivate = Boolean(data.private);
  const defaultBranch = (data.default_branch as string) || "main";
  const htmlUrl = (data.html_url as string) || "";
  const avatarUrl = (data.owner.avatar_url as string) || "";

  let latestCommitSha: string | null = null;

  try {
    const { data: branchData } = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch: defaultBranch,
    });
    latestCommitSha = branchData.commit.sha || null;
  } catch {
    // If branch lookup fails, attempt fetching the commit directly or gracefully return null
    try {
      const { data: commitData } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: defaultBranch,
      });
      latestCommitSha = commitData.sha || null;
    } catch {
      latestCommitSha = null;
    }
  }

  return {
    repo,
    owner,
    isPrivate,
    defaultBranch,
    latestCommitSha,
    htmlUrl,
    avatarUrl,
  };
}

/**
 * Fetches all changed files between baseSha and headSha using GitHub's commit comparison API.
 * Safely handles pagination to retrieve all files.
 */
export async function getChangedFilesBetweenCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  baseSha: string,
  headSha: string,
): Promise<ChangedFile[]> {
  if (!baseSha || !headSha || baseSha === headSha) {
    return [];
  }

  let page = 1;
  const allFiles: ChangedFile[] = [];

  while (true) {
    const response = await octokit.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${baseSha}...${headSha}`,
      per_page: 100,
      page,
    });

    const files = response.data.files;
    if (files && files.length > 0) {
      for (const file of files) {
        allFiles.push({
          filename: file.filename,
          status: file.status,
          previous_filename: file.previous_filename,
        });
      }
    }

    const linkHeader = response.headers.link;
    const hasNextPage = linkHeader && linkHeader.includes('rel="next"');

    if (!hasNextPage || !files || files.length < 100) {
      break;
    }

    page++;
  }

  return allFiles;
}

/**
 * Fetches the UTF-8 text content of a file at a specific commit SHA.
 * Returns null if the file cannot be read or is not text.
 */
export async function fetchFileContentAtSha(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  sha: string,
): Promise<string | null> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: sha,
    });

    if (data && !Array.isArray(data) && data.type === "file") {
      if (data.content && data.encoding === "base64") {
        return Buffer.from(data.content, "base64").toString("utf-8");
      }

      // If content is omitted for large files, fetch via git blob
      if (data.sha) {
        const { data: blob } = await octokit.rest.git.getBlob({
          owner,
          repo,
          file_sha: data.sha,
        });
        if (blob.content && blob.encoding === "base64") {
          return Buffer.from(blob.content, "base64").toString("utf-8");
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}
