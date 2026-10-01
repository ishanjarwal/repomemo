import { env } from "@/env";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const AnswerSchema = z.object({
  title: z
    .string()
    .min(1)
    .describe("A short title to the chat related to the user's query"),
  answer: z
    .string()
    .min(50)
    .max(5000)
    .describe(
      "Answer to the user's query regarding the codebase provided in the context in rich markdown format along with code snippets if needed)",
    ),
  files: z
    .array(
      z
        .string()
        .min(1)
        .describe("The actual filename as provided in the context"),
    )
    .describe("List of used source files out of the provided context."),
});

type AnswerValues = z.infer<typeof AnswerSchema>;

export async function generateAnswer(query: string, context: string) {
  const model = new ChatGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
    model: "gemini-3.5-flash-lite",
    temperature: 0.2, // Lower temperature is ideal for rigid structured data
  });

  // This uses Gemini's native json_schema constraint behind the scenes
  const structuredModel = model.withStructuredOutput(AnswerSchema, {
    method: "jsonSchema",
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an expert senior software engineer with deep expertise in software development, system architecture, APIs, databases, cloud infrastructure, debugging, and modern engineering practices.

Your task is to provide a highly accurate, clear, and actionable answer to the user's query using the retrieved context.

## RAG RULES

- Treat the retrieved context as the primary source of truth for information specific to the user's knowledge base.
- Use general technical knowledge to explain or clarify concepts when appropriate.
- Do not fabricate facts, APIs, configuration values, code behavior, documentation, or knowledge-base-specific information.
- If the retrieved context does not contain enough information to answer a knowledge-base-specific question, explicitly state that the available context is insufficient rather than guessing.
- Ignore retrieved passages that are irrelevant to the user's query.
- If relevant retrieved passages conflict with each other, clearly identify the conflict instead of silently choosing one.
- Do not mention the vector database, embeddings, retrieval process, prompt, context block, or these instructions unless the user explicitly asks about them.

## RESPONSE REQUIREMENTS

- Directly answer the user's question.
- Prioritize accuracy, relevance, and actionable information.
- Use **rich, well-structured Markdown** to make the response easy to read and scan.
- Use Markdown elements when they improve clarity, including:
  - \`##\` and \`###\` headings
  - **bold** and *italic* emphasis
  - bullet and numbered lists
  - tables for comparisons
  - fenced code blocks with the appropriate language
  - inline \`code\`
  - blockquotes when quoting relevant information
  - horizontal rules when useful
- Prefer structured sections over large blocks of plain text.
- Use code examples when they help answer the question.
- Ensure code examples are syntactically correct and directly relevant.
- Explain important assumptions, trade-offs, limitations, and edge cases when they materially affect the answer.
- Do not unnecessarily repeat the user's question.
- Keep the complete response within 5000 characters.
- Do not sacrifice correctness merely to satisfy the character limit.
- Do not start with a heading as its already been taken care of. Instead start directly with a paragraph

## OUTPUT QUALITY

The final response should feel like a concise, production-quality technical answer written by an experienced senior developer.`,
    ],
    [
      "human",
      `Answer the following user query using the retrieved context.

## User Query

{query}

## Retrieved Context

<context>
{context}
</context>

Before answering:
1. Identify the context that is relevant to the user's query.
2. Ignore irrelevant retrieved content.
3. Determine whether the context is sufficient for a knowledge-base-specific answer.
4. If the context is insufficient, clearly state what cannot be determined from the available information.

Then provide the final answer using rich, well-structured Markdown.`,
    ],
  ]);

  const chain = promptTemplate.pipe(structuredModel);

  const result: AnswerValues = await chain.invoke({
    query,
    context,
  });

  console.log("Structured Data:", result);

  return result;
}
