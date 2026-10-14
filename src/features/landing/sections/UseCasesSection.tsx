"use client";

import {
  Briefcase,
  Compass,
  GitMerge,
  Laptop,
  Sparkles,
  UserCheck,
  Users,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const UseCasesSection = () => {
  const personas = [
    {
      icon: UserCheck,
      role: "The New Hire on Day One",
      tagline: "Ship a production PR in Week 1, not Month 2",
      scenario:
        "You just joined an engineering team with a 70,000-line monolithic codebase. No documentation, half the team is in a different timezone, and you need to build your first feature.",
      promptExample:
        "Where in the application is the Stripe customer portal session generated and what middleware protects it?",
      outcome:
        "Autonomous onboarding without feeling like a burden to senior mentors.",
    },
    {
      icon: GitMerge,
      role: "The Tech Lead & Code Reviewer",
      tagline: "Audit PR blast radius before hitting merge",
      scenario:
        "A contributor opened a PR refactoring database schema or updating authentication cookies. You need to know which auxiliary background jobs or webhooks might fail.",
      promptExample:
        "What background Inngest functions or tRPC routers read the ProjectJob status field?",
      outcome:
        "Spot regressions and race conditions before code ever reaches staging.",
    },
    {
      icon: Compass,
      role: "The Open-Source Explorer",
      tagline: "Navigate massive 50k-star libraries with ease",
      scenario:
        "You want to fix a bug or add an integration to Next.js, LangChain, or Prisma, but the codebase size is utterly intimidating.",
      promptExample:
        "How does the custom provider interface register new LLM backends?",
      outcome:
        "Find the exact entrypoint and file interfaces in seconds without maintainer hand-holding.",
    },
    {
      icon: Briefcase,
      role: "The Contractor & Agency Builder",
      tagline: "Audit legacy client codebases on a tight deadline",
      scenario:
        "You inherit an undocumented startup repository that three different dev agencies touched over four years. Client expects a feature roadmap in 48 hours.",
      promptExample:
        "List all external third-party API integrations, secret keys required, and database relationships.",
      outcome:
        "Deliver an architectural audit report on Day 1 that blows clients away.",
    },
  ];

  return (
    <section id="use-cases" className="bg-background scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-3 font-mono text-xs tracking-wider uppercase"
          >
            Tailored Engineering Workflows
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Built for developers who value their engineering velocity
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Whether you&apos;re ramping up on day one, auditing critical PRs, or
            navigating open source giants, RepoMemo removes the cognitive
            friction of reading complex code.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <Card
                key={index}
                className="border-border bg-card hover:border-primary/40 shadow-xs transition-all hover:shadow-md"
              >
                <CardContent className="space-y-4 p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-foreground text-base font-bold sm:text-lg">
                        {persona.role}
                      </h3>
                      <p className="text-primary text-xs font-medium">
                        {persona.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                    {persona.scenario}
                  </p>

                  {/* Sample Query Box */}
                  <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3">
                    <span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
                      Sample Query:
                    </span>
                    <p className="font-code text-foreground text-xs italic">
                      &quot;{persona.promptExample}&quot;
                    </p>
                  </div>

                  <div className="text-foreground flex items-center gap-2 pt-2 text-xs font-medium">
                    <Sparkles className="text-primary size-3.5 shrink-0" />
                    <span>Result: {persona.outcome}</span>
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
