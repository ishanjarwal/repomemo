"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Is my private code stored or used to train AI models?",
      answer:
        "No. We never train, fine-tune, or store your proprietary source code for model improvements. Embeddings and file summaries are generated strictly for vector search retrieval and stored securely in your dedicated PostgreSQL instance with row-level tenant security.",
    },
    {
      question: "How do you handle private GitHub repositories securely?",
      answer:
        "You can connect private repositories using a fine-grained GitHub Personal Access Token (PAT) with read-only 'Contents' permission. All tokens are symmetrically AES-encrypted at rest before database storage and decrypted only during transient indexing execution inside isolated Inngest workers.",
    },
    {
      question:
        "What happens when our team pushes new commits or updates branches?",
      answer:
        "RepoMemo indexes your repository at a specific Git commit SHA, ensuring deterministic answers that don't drift or hallucinate against transient working copies. You can re-index or update your repository to the latest HEAD commit whenever your team merges significant PRs.",
    },
    {
      question: "Which programming languages and file formats are supported?",
      answer:
        "RepoMemo supports all major languages: TypeScript, JavaScript, Python, Go, Rust, Java, C/C++, Ruby, PHP, SQL, Prisma schemas, HTML/CSS, JSON, YAML, and Dockerfiles. Build artifacts, lockfiles (package-lock, yarn.lock), minified assets, and binary files are automatically pruned during AST tree parsing.",
    },
    {
      question: "How fast is repository indexing and query answering?",
      answer:
        "Repositories with 100 to 500 code files typically index within 60 to 180 seconds via asynchronous Inngest pipelines. Once indexed, answering architectural questions takes 200 to 500ms thanks to pgvector high-dimensional cosine indexing in PostgreSQL.",
    },
    {
      question: "How does the credit system work?",
      answer:
        "Every new user receives 25 free credits upon sign-up. Indexing a repository consumes credits based on its file count (with a minimum of 25 credits). Asking architectural questions consumes 1 credit per answer. Purchased credits via Polar checkouts never expire.",
    },
  ];

  return (
    <section
      id="faq"
      className="bg-muted/20 border-border/60 scroll-mt-20 border-b py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-3 font-mono text-xs tracking-wider uppercase"
          >
            Clear Answers
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Everything you need to know about code security, private repository
            indexing, and vector architecture.
          </p>
        </div>

        {/* Accordion Component */}
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border bg-card rounded-xl border px-4 shadow-2xs sm:px-6"
              >
                <AccordionTrigger className="text-foreground py-4 text-left text-xs font-semibold hover:no-underline sm:text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-xs leading-relaxed sm:text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
