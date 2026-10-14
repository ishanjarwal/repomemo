import { env } from "@/env";
import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

/**
 * Returns an Octokit instance authenticated with the provided token,
 * or falls back to the default octokit instance.
 */
export function getOctokit(token?: string | null): Octokit {
  if (token && token.trim().length > 0) {
    return new Octokit({
      auth: token.trim(),
    });
  }

  return octokit;
}
