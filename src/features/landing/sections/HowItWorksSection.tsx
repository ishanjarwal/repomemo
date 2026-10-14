"use client";

import {
  Cpu,
  Database,
  FileCheck,
  GitCommit,
  GitPullRequest,
  Layers,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: GitCommit,
      title: "Tree Ingestion & Commit Anchoring",
      badge: "GitHub API & Inngest",
      description:
        "Point to any public repository or connect a private repo with an AES-encrypted Personal Access Token. RepoMemo fetches the file tree at the active commit SHA, automatically discarding build noise, lockfiles, and binary assets.",
      details: [
        "Commit-anchored indexing prevents stale cache",
        "Encrypted PAT handling in compliance with zero-leak protocols",
        "Intelligent AST filtering for code, schemas, and configs",
      ],
    },
    {
      step: "02",
      icon: Database,
      title: "768-Dim pgvector Semantic Graph",
      badge: "Google GenAI + pgvector",
      description:
        "Files are summarized and vectorized into 768-dimensional dense embeddings. Stored directly within PostgreSQL using the pgvector extension, creating an architectural spatial graph of your entire codebase.",
      details: [
        "Semantic similarity matches intent, not just raw keywords",
        "Sub-second vector retrieval over thousands of code files",
        "Relationship modeling across caller and callee modules",
      ],
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Grounded Synthesis & File Citations",
      badge: "Zero Hallucination RAG",
      description:
        "When you ask a question, RepoMemo retrieves the most relevant multi-file code fragments, synthesizes the execution flow, and presents answers complete with exact file paths, line ranges, and follow-up prompts.",
      details: [
        "Every claim is linked to source code line numbers",
        "Generates suggested follow-up queries automatically",
        "Persists answers to project history for team reference",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-muted/20 border-border/60 scroll-mt-20 border-b py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-3 font-mono text-xs tracking-wider uppercase"
          >
            Under the Hood
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            How RepoMemo constructs living repository memory
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            A resilient, deterministic RAG architecture engineered specifically
            for source code trees, dependencies, and cross-file relationships.
          </p>
        </div>

        {/* 3 Step Pipeline Cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="border-border bg-card hover:border-primary/40 relative flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
              >
                <CardContent className="space-y-5 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-code text-muted-foreground/30 text-2xl font-black">
                      {item.step}
                    </span>
                    <Badge variant="secondary" className="text-2xs font-mono">
                      {item.badge}
                    </Badge>
                  </div>

                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <Icon className="size-5" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-foreground text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  <div className="border-border/60 space-y-2 border-t pt-3">
                    {item.details.map((detail, dIdx) => (
                      <div
                        key={dIdx}
                        className="text-2xs text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
