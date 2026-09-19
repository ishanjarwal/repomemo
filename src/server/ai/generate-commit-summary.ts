import { env } from "@/env";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const CommitSummarySchema = z.object({
  summary: z
    .string()
    .min(50)
    .max(500)
    .describe(
      "git commit summary in markdown list format (use inline code block for filenames)",
    ),
});

type CommitSummaryValues = z.infer<typeof CommitSummarySchema>;

export async function generateCommitSummary(
  commit_message: string,
  commit_diff: string,
) {
  const model = new ChatGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
    model: "gemini-3.5-flash-lite",
    temperature: 0.2, // Lower temperature is ideal for rigid structured data
  });

  // This uses Gemini's native json_schema constraint behind the scenes
  const structuredModel = model.withStructuredOutput(CommitSummarySchema);

  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an expert Git commit summarizer. Provide highly accurate summary (within 300 characters) in markdown list form for the diff provided by the user.",
    ],
    [
      "human",
      `Generate a short summary for the changes made in this git commit :
        Commit message by commiter - {commit_message}
        Commit diffs :
        {commit_diff}
        `,
    ],
  ]);

  const chain = promptTemplate.pipe(structuredModel);

  const result: CommitSummaryValues = await chain.invoke({
    commit_message,
    commit_diff,
  });

  console.log("Structured Data:", JSON.stringify(result, null, 2));

  return result.summary;
}
