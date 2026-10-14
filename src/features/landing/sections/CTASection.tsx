"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

interface CTASectionProps {
  user?: {
    name?: string | null;
  } | null;
}

export const CTASection = ({ user }: CTASectionProps) => {
  return (
    <section className="bg-background relative overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-primary/30 bg-primary/5 relative overflow-hidden rounded-3xl border p-8 sm:p-14 lg:p-16">
          {/* Subtle Animated Background Grid */}
          <AnimatedGridPattern
            numSquares={20}
            maxOpacity={0.12}
            duration={4}
            repeatDelay={1}
            className="mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"
          />

          <div className="relative mx-auto max-w-3xl space-y-6 text-center">
            <h2 className="font-heading text-foreground text-3xl font-extrabold tracking-tight sm:text-5xl">
              Turn your repository from a labyrinth into an open book.
            </h2>

            <p className="text-muted-foreground mx-auto max-w-xl text-sm leading-relaxed sm:text-base">
              Stop losing productive hours to blind searching and stale wikis.
              Index your repository today and experience grounded, multi-file
              code intelligence.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                asChild
                className="h-11 gap-2 px-7 text-sm font-semibold shadow-md"
              >
                <Link href={user ? "/dashboard" : "/signup"}>
                  <Sparkles className="size-4" />
                  <span>
                    {user
                      ? "Open Your Dashboard"
                      : "Start Free with 25 Credits"}
                  </span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-11 gap-2 px-7 text-sm font-medium"
              >
                <a
                  href="https://github.com/ishanjarwal/repomemo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="size-4" />
                  <span>Star on GitHub</span>
                </a>
              </Button>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="text-primary size-3.5" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="text-primary size-3.5" />
                <span>60-Second Setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="text-primary size-3.5" />
                <span>Public & Private Repositories</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
