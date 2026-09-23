import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const generateRepoFilesSummaryEmbeddings = async (
  summaries: { source: string; summary: string }[],
) => {
  const model = new GoogleGenerativeAIEmbeddings({
    apiKey: env.GEMINI_API_KEY,
    model: "gemini-embedding-001",
    maxConcurrency: 25,
    outputDimensionality: 768,
  });

  const embeddings = await model.embedDocuments(
    summaries.map((summary) => summary.summary),
  );

  const data = summaries.map((summary, i) => ({
    source: summary.source,
    summary: summary.summary,
    embedding: embeddings[i],
  }));

  return data;
};
