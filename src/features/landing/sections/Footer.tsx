"use client";

import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import ThemeToggleButton from "@/components/common/ThemeToggleButton";
import { Badge } from "@/components/ui/badge";

export const Footer = () => {
  return (
    <footer className="border-border bg-card/60 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="border-border bg-background size-8 shrink-0 overflow-hidden rounded-lg border shadow-xs">
                <Image
                  src="/logo_light.png"
                  alt="RepoMemo"
                  width={32}
                  height={32}
                  className="block h-full w-full object-cover dark:hidden"
                />
                <Image
                  src="/logo_dark.png"
                  alt="RepoMemo"
                  width={32}
                  height={32}
                  className="hidden h-full w-full object-cover dark:block"
                />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight">
                RepoMemo
              </span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed">
              AI RAG codebase intelligence and memory engine. Transform complex
              repositories into verified architectural answers.
            </p>
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-emerald-500" />
              <span className="text-2xs text-muted-foreground font-mono">
                Systems Operational
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="#the-problem"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  The Problem
                </Link>
              </li>
              <li>
                <Link
                  href="#interactive-demo"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Live Demo Sandbox
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#use-cases"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Developer Workflows
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Credit Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div className="space-y-3">
            <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Tech Stack
            </h4>
            <ul className="text-muted-foreground space-y-2 text-xs">
              <li>Next.js 16 App Router</li>
              <li>PostgreSQL with pgvector</li>
              <li>Inngest Background Workflows</li>
              <li>Google GenAI (Gemini)</li>
              <li>Better-Auth & Polar Billing</li>
              <li>Shadcn UI & Tailwind CSS v4</li>
            </ul>
          </div>

          {/* Access & Community */}
          <div className="space-y-3">
            <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Account & Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign up (Free 25 Credits)
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Developer Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ishanjarwal/repomemo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                >
                  <FaGithub className="size-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} RepoMemo. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-2xs text-muted-foreground">Appearance:</span>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </footer>
  );
};
