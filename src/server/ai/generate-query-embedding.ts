import { env } from "@/env";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const generateQueryEmbedding = async (query: string) => {
  const model = new GoogleGenerativeAIEmbeddings({
    apiKey: env.GEMINI_API_KEY,
    model: "gemini-embedding-001",
    outputDimensionality: 768,
  });

  const embeddings = await model.embedQuery(query);

  return embeddings;
};
