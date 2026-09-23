import { env } from "@/env";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const FileSummarySchema = z.object({
  source: z.string().describe("The original provided file path source as is"),
  summary: z
    .string()
    .min(50)
    .max(500)
    .describe("summary of the code file in markdown format"),
});

type FileSummaryValues = z.infer<typeof FileSummarySchema>;

export async function generateRepoContentSummary(docs: Document[]) {
  const model = new ChatGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
    model: "gemini-3.5-flash-lite",
    temperature: 0.2, // Lower temperature is ideal for rigid structured data
  });

  // This uses Gemini's native json_schema constraint behind the scenes
  const structuredModel = model.withStructuredOutput(
    z.array(FileSummarySchema),
  );

  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an expert code file summarizer. Provide highly accurate summaries in markdown format for the files provided by the user.",
    ],
    [
      "human",
      `Generate summaries for the code files :
      {FILES}
        `,
    ],
  ]);

  const chain = promptTemplate.pipe(structuredModel);

  const result: FileSummaryValues[] = await chain.invoke({
    FILES: docs.map(
      (doc, idx) =>
        `
          ${idx + 1}. - ${doc.metadata.source}
          START FILE
          ${doc.pageContent}
          END FILE
          
          `,
    ),
  });

  return result;
}
