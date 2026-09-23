import { env } from "@/env";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const repoContentLoader = async (url: string, token?: string) => {
  const loader = new GithubRepoLoader(url, {
    accessToken: token || env.GITHUB_TOKEN,
    branch: "main",
    recursive: true,
    maxConcurrency: 5,
    ignoreFiles: [
      "dist/**",
      "public/**",
      "generated/**",
      "node_modules/**",
      "package-lock.json",
      "yarn.lock",
      "**/.*/**", // Ignores all hidden folders and their contents
    ],
  });

  return await loader.load();
};
