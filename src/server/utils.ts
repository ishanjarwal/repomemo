import { Octokit } from "octokit";
import { PROJECT_SIZE, ProjectSize } from "./constants";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

/**
 * Validates the provided github url for url schema, throws error if invalid
 * @param githubUrl
 */
export function parseGitHubUrl(githubUrl: string) {
  const url = new URL(githubUrl);

  // Only allow github.com URLs
  if (url.hostname !== "github.com") {
    return null;
  }

  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, "");

  if (!owner || !repo) {
    return null;
  }

  return { owner, repo };
}

export function chunkArray<T>(arr: T[], size: number = 5): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function prepareQueryContext(files: { source: string; code: string }[]) {
  let ctx = "";

  for (const file of files) {
    ctx += `
    File : ${file.source}
    Code : 
    ${file.code}
    ---
    `;
  }

  return ctx;
}

export const getProjectSize = (fileCount: number): ProjectSize => {
  if (fileCount <= PROJECT_SIZE.small.maxFiles) return "small";
  if (fileCount <= PROJECT_SIZE.medium.maxFiles) return "medium";

  return "large";
};

export async function verifyPrivateRepo(
  token: string,
  owner?: string,
  repo?: string,
) {
  const octokit = new Octokit({ auth: token.trim() });
  try {
    if (owner && repo) {
      await octokit.rest.repos.get({ owner, repo });
      return true;
    }
    await octokit.rest.users.getAuthenticated();
    return true;
  } catch (error) {
    return false;
  }
}

export async function checkCredits(credits: number, userId: string) {
  const current = await prisma.credits.findUnique({ where: { userId } });
  if (!current) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Something went wrong",
    });
  }

  if (current.credits - credits < 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You are short of credits. Please buy some credits to continue.",
    });
  }
}

export async function consumeCredits(credits: number, userId: string) {
  await prisma.credits.update({
    where: { userId },
    data: { credits: { decrement: credits } },
  });
}
