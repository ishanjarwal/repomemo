export function parseGitHubUrl(githubUrl: string) {
  try {
    const url = new URL(githubUrl);

    // Only allow github.com URLs
    if (url.hostname !== "github.com") {
      throw new Error("Invalid GitHub URL");
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL");
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");

    return { owner, repo };
  } catch {
    throw new Error("Invalid GitHub repository URL");
  }
}
