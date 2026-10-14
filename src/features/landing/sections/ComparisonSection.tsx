"use client";

import { Check, Minus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const ComparisonSection = () => {
  const comparisonItems = [
    {
      feature: "Cross-file semantic understanding",
      repomemo: true,
      copilotChat: "Partial",
      ideGrep: false,
      notionWiki: false,
    },
    {
      feature: "Grounded line-level source citations",
      repomemo: true,
      copilotChat: "Inconsistent",
      ideGrep: false,
      notionWiki: false,
    },
    {
      feature: "Anchored to active Git commit SHA",
      repomemo: true,
      copilotChat: false,
      ideGrep: true,
      notionWiki: false,
    },
    {
      feature: "AST-aware noise & asset pruning",
      repomemo: true,
      copilotChat: false,
      ideGrep: false,
      notionWiki: false,
    },
    {
      feature: "Zero LLM training on private code",
      repomemo: true,
      copilotChat: "Config dependent",
      ideGrep: true,
      notionWiki: true,
    },
    {
      feature: "Persistent query & answer history",
      repomemo: true,
      copilotChat: false,
      ideGrep: false,
      notionWiki: "Manual",
    },
  ];

  return (
    <section
      id="comparison"
      className="bg-muted/20 border-border/60 scroll-mt-20 border-y py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-3 font-mono text-xs tracking-wider uppercase"
          >
            Objective Breakdown
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Why RepoMemo outperforms traditional codebase discovery
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            See how purpose-built repository RAG stacks up against generic
            chatbots, blind regex search, and manual wikis.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="border-border bg-card mt-14 overflow-hidden rounded-xl border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-border bg-muted/40 text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-4 font-semibold sm:px-6">
                    Capability
                  </th>
                  <th className="text-primary bg-primary/5 border-border border-x px-4 py-4 font-bold sm:px-6">
                    RepoMemo RAG
                  </th>
                  <th className="px-4 py-4 font-semibold sm:px-6">
                    Inline AI Chat
                  </th>
                  <th className="px-4 py-4 font-semibold sm:px-6">
                    IDE Grep / Ctrl+F
                  </th>
                  <th className="px-4 py-4 font-semibold sm:px-6">
                    Static Notion Wikis
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {comparisonItems.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="text-foreground px-4 py-4 font-medium sm:px-6">
                      {item.feature}
                    </td>

                    {/* RepoMemo Column */}
                    <td className="bg-primary/5 border-border border-x px-4 py-4 font-semibold sm:px-6">
                      <div className="text-primary flex items-center gap-1.5">
                        <Check className="size-4 shrink-0" />
                        <span>Included</span>
                      </div>
                    </td>

                    {/* Inline AI Chat */}
                    <td className="text-muted-foreground px-4 py-4 sm:px-6">
                      {item.copilotChat === true ? (
                        <Check className="text-foreground size-4" />
                      ) : item.copilotChat === false ? (
                        <X className="text-muted-foreground/60 size-4" />
                      ) : (
                        <span>{item.copilotChat}</span>
                      )}
                    </td>

                    {/* IDE Grep */}
                    <td className="text-muted-foreground px-4 py-4 sm:px-6">
                      {item.ideGrep === true ? (
                        <Check className="text-foreground size-4" />
                      ) : (
                        <X className="text-muted-foreground/60 size-4" />
                      )}
                    </td>

                    {/* Notion Wiki */}
                    <td className="text-muted-foreground px-4 py-4 sm:px-6">
                      {item.notionWiki === true ? (
                        <Check className="text-foreground size-4" />
                      ) : item.notionWiki === false ? (
                        <X className="text-muted-foreground/60 size-4" />
                      ) : (
                        <span>{item.notionWiki}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
