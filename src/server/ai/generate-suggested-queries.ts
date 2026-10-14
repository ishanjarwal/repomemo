import { env } from "@/env";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { octokit } from "../github/client";
import { parseGitHubUrl } from "../utils";

const SuggestedQueriesSchema = z.array(
  z
    .string()
    .min(50)
    .max(500)
    .describe("suggestion for query prompt related to this repo"),
);

type SuggestedQueriesValues = z.infer<typeof SuggestedQueriesSchema>;

export async function generateSuggestedQueries(
  repo_url: string,
  tree_sha: string,
) {
  const parsed = parseGitHubUrl(repo_url);
  if (!parsed) return [];

  const { owner, repo } = parsed;
  const { data: repoData } = await octokit.rest.repos.get({
    owner,
    repo,
    tree_sha,
  });

  //   fetch the readme
  let README = null;
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner,
      repo,
      tree_sha,
    });

    README = Buffer.from(data.content, "base64").toString("utf-8");
  } catch (error) {}

  //   fetch the folder tree :
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha,
    recursive: "true",
  });

  const folderStructure = treeData.tree
    .filter((item) => item.type === "tree" || item.type === "blob")
    .map((item) => ({
      path: item.path,
      type: item.type === "tree" ? "directory" : "file",
    }));

  const model = new ChatGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_TEXT_MODEL,
    temperature: 0.2, // Lower temperature is ideal for rigid structured data
  });

  // This uses Gemini's native json_schema constraint behind the scenes
  const structuredModel = model.withStructuredOutput(SuggestedQueriesSchema);

  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an expert github repo readme and folder structure analyzer. Provide 3 - 5 highly related query suggestions for the github repo according to its description, README.md and/or Folder Structure.",
    ],
    [
      "human",
      `Generate query suggestions for this github repo :

      -- Repo Name and Description --
      {REPO_URL}
      {DESCRIPTION}

      -- README.md --
      {README}

      -- Folder Structure --
      {FOLDER_STRUCTURE}


      If the provided context is not enough, generate 3 - 5 random and generic query suggestions. For eg: 'Where is authentication handled in this project ?'
        `,
    ],
  ]);

  const chain = promptTemplate.pipe(structuredModel);

  const result: SuggestedQueriesValues = await chain.invoke({
    REPO_URL: `https://github.com/${owner}/${repo}`,
    DESCRIPTION: repoData.description,
    README,
    FOLDER_STRUCTURE: folderStructure,
  });

  // console.log(result);

  return result;
}
