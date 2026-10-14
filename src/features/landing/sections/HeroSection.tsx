"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  user?: {
    name?: string | null;
  } | null;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background Subtle Grid Pattern */}
      <AnimatedGridPattern
        numSquares={28}
        maxOpacity={0.15}
        duration={3}
        repeatDelay={1}
        className="mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Announcement / Status Pill */}
          <Link
            href="#demo-video"
            className="group border-border bg-card/80 text-foreground hover:border-primary/50 hover:bg-card mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-xs transition-colors"
          >
            <span className="bg-primary flex size-2 animate-pulse rounded-full" />
            <span className="text-muted-foreground">
              Announcing RepoMemo RAG
            </span>
            <span className="text-border">|</span>
            <span className="text-primary font-semibold">
              Interactive Codebase Demo
            </span>
            <ChevronRight className="text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Main Provocative Headline */}
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.12]">
            Your codebase has{" "}
            <span className="text-muted-foreground line-through">
              50,000 lines
            </span>
            .
            <br />
            <span className="from-foreground via-foreground to-muted-foreground bg-linear-to-r bg-clip-text text-transparent">
              RepoMemo knows every single one.
            </span>
          </h1>

          {/* Narrative Lead */}
          <p className="text-muted-foreground mt-6 max-w-2xl text-base sm:text-lg sm:leading-relaxed">
            Stop losing hours to blind grep, stale documentation, or endless
            context-switching. RepoMemo parses your AST, vectorizes your entire
            Git tree into pgvector, and gives you precise architectural answers
            backed by verified file citations.
          </p>

          {/* Primary Call to Action buttons */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              asChild
              className="h-11 gap-2 px-6 text-sm font-semibold shadow-sm"
            >
              <Link href={user ? "/dashboard" : "/signup"}>
                <Sparkles className="size-4" />
                <span>
                  {user ? "Go to your Dashboard" : "Index a Repository Free"}
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-11 gap-2 px-6 text-sm font-medium"
            >
              <Link href="#demo-video">
                <Play className="text-primary size-4" />
                <span>Watch Demo</span>
              </Link>
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="text-primary size-3.5" />
              <span>25 Free Credits on Signup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="text-primary size-3.5" />
              <span>Encrypted PAT for Private Repos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="text-primary size-3.5" />
              <span>Zero LLM Training on Your Code</span>
            </div>
          </div>

          {/* Demo Video */}
          <div id="demo-video" className="pt-12">
            <video autoPlay={false} controls={true}>
              <source src="https://res.cloudinary.com/dsf4t9wmc/video/upload/v1791969318/14435711_960_540_30fps_mlvkam.mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};
