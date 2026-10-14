"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggleButton from "@/components/common/ThemeToggleButton";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const NAV_LINKS = [
  { href: "#the-problem", label: "The Problem" },
  { href: "#interactive-demo", label: "Live Demo" },
  { href: "#how-it-works", label: "Architecture" },
  { href: "#use-cases", label: "Workflows" },
  { href: "#comparison", label: "Comparison" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export const Navbar = ({ user }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-border/60 bg-background/85 sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="border-border bg-card size-8 shrink-0 overflow-hidden rounded-lg border shadow-xs">
            <Image
              src="/logo_light.png"
              alt="RepoMemo Logo"
              width={32}
              height={32}
              className="block h-full w-full object-cover dark:hidden"
              priority
            />
            <Image
              src="/logo_dark.png"
              alt="RepoMemo Logo"
              width={32}
              height={32}
              className="hidden h-full w-full object-cover dark:block"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold tracking-tight">
              RepoMemo
            </span>
            <Badge
              variant="secondary"
              className="hidden text-xs font-semibold sm:inline-flex"
            >
              AI RAG
            </Badge>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggleButton />

          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
            <a
              href="https://github.com/ishanjarwal/repomemo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
            >
              <FaGithub className="size-4" />
              <span className="hidden lg:inline">GitHub</span>
            </a>
          </Button>

          {user ? (
            <Button size="sm" asChild className="gap-1.5 text-xs">
              <Link href="/dashboard">
                <span>Dashboard</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="gap-1.5 text-xs">
                <Link href="/signup">
                  <Sparkles className="size-3.5" />
                  <span>Start Free</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggleButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-border bg-background animate-in fade-in slide-in-from-top-2 border-b px-4 pt-2 pb-6 sm:hidden">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-border mt-4 flex flex-col gap-2 border-t pt-3">
            {user ? (
              <Button asChild className="w-full justify-center text-xs">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-center text-xs"
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild className="w-full justify-center text-xs">
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Sparkles className="mr-1.5 size-3.5" />
                    Start Free (25 Credits)
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
