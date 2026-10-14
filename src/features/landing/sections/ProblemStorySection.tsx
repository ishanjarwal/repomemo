"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileWarning,
  HelpCircle,
  Layers,
  MessageSquare,
  Search,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProblemStorySection = () => {
  return (
    <section id="the-problem" className="bg-background scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-3 font-mono text-xs tracking-wider uppercase"
          >
            The Developer Reality
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Why is reading code 10x harder than writing it?
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Modern software engineering isn&apos;t limited by your ability to
            write loops or functions. It is choked by the lost days spent
            deciphering 100,000 lines of legacy architecture.
          </p>
        </div>

        {/* Narrative Comparison Grid: The Old Way vs The RepoMemo Way */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Column 1: The Frustrating Old Way */}
          <div className="border-destructive/30 bg-destructive/5 space-y-6 rounded-2xl border p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 text-destructive flex size-9 items-center justify-center rounded-lg">
                <FileWarning className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-foreground text-lg font-bold">
                  The Exhausting Status Quo
                </h3>
                <p className="text-muted-foreground text-xs">
                  Blind searches, broken assumptions, and wasted sprint cycles
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-border/80 bg-background/90 rounded-xl border p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <Search className="text-destructive mt-0.5 size-4 shrink-0" />
                  <div>
                    <h4 className="text-foreground text-xs font-semibold">
                      Blind Grep & 400 False Positives
                    </h4>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      You search for an action name and get buried under
                      lockfiles, mock tests, and type declarations with zero
                      clues about the runtime execution flow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-border/80 bg-background/90 rounded-xl border p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <MessageSquare className="text-destructive mt-0.5 size-4 shrink-0" />
                  <div>
                    <h4 className="text-foreground text-xs font-semibold">
                      The Senior Engineer Tax
                    </h4>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      You hesitate to open a PR because you don&apos;t know what
                      hidden side effects might explode. You interrupt senior
                      engineers on Slack, derailing their focus.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-border/80 bg-background/90 rounded-xl border p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <Clock className="text-destructive mt-0.5 size-4 shrink-0" />
                  <div>
                    <h4 className="text-foreground text-xs font-semibold">
                      Stale Wikis & Dead Docs
                    </h4>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      The README says to configure a Redis queue that was
                      replaced 6 months ago. The architecture docs were never
                      updated, leaving you to reverse-engineer Git blame.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: The RepoMemo Revolution */}
          <div className="border-primary/30 bg-primary/5 space-y-6 rounded-2xl border p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                <Zap className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-foreground text-lg font-bold">
                  The RepoMemo Reality
                </h3>
                <p className="text-muted-foreground text-xs">
                  Living, photographic memory grounded in your exact repository
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-border/80 bg-background/90 rounded-xl border p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                  <div>
                    <h4 className="text-foreground text-xs font-semibold">
                      Semantic Graph & AST-Aware Search
                    </h4>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      RepoMemo understands that{" "}
                      <code className="font-code text-2xs bg-muted rounded px-1 py-0.5">
                        UserButton.tsx
                      </code>{" "}
                      connects to{" "}
                      <code className="font-code text-2xs bg-muted rounded px-1 py-0.5">
                        auth.ts
                      </code>{" "}
                      and Prisma session records—even if they share no exact
                      keywords.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-border/80 bg-background/90 rounded-xl border p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                  <div>
                    <h4 className="text-foreground text-xs font-semibold">
                      Autonomous Onboarding in Minutes
                    </h4>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      New hires ship their first production pull request on Day
                      2 instead of Week 3. Ask architectural questions in
                      natural language and receive step-by-step traces.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-border/80 bg-background/90 rounded-xl border p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                  <div>
                    <h4 className="text-foreground text-xs font-semibold">
                      Always Synchronized to Commit SHA
                    </h4>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      Never trust stale documentation again. RepoMemo anchors
                      answers to the active Git commit SHA and points you
                      directly to line numbers in source files.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
