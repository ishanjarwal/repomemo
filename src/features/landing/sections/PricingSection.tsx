"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Coins,
  HelpCircle,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { RiCoinFill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

// Pricing tier information copied from server/constants.ts for client usage
const CREDIT_TIERS = [
  {
    slug: "100",
    credits: 100,
    price: 1,
    label: "100",
    description:
      "Indexes up to 2 small repositories or powers 100 deep queries",
  },
  {
    slug: "250",
    credits: 250,
    price: 2.5,
    label: "250",
    description: "Indexes up to 5 small or 2 medium repositories",
  },
  {
    slug: "500",
    credits: 500,
    price: 5,
    label: "500",
    description: "Indexes up to 10 small or 5 medium repositories",
  },
  {
    slug: "1000",
    credits: 1000,
    price: 10,
    label: "1k",
    description:
      "Ideal for active developers: 10 medium repos or 1,000 queries",
    popular: true,
  },
  {
    slug: "5000",
    credits: 5000,
    price: 50,
    label: "5k",
    description: "Designed for power builders auditing multi-branch codebases",
  },
  {
    slug: "10000",
    credits: 10000,
    price: 100,
    label: "10k",
    description: "Enterprise volume capacity for large teams and agencies",
  },
] as const;

const UNIFIED_FEATURES = [
  "Full 768-dimensional pgvector semantic indexing",
  "Verified line-level source code citations with direct file links",
  "Intelligent AST-aware tree pruning (removes lockfiles, build assets)",
  "Public and private repository support with AES-encrypted PATs",
  "Multi-file execution flow synthesis and suggested follow-up queries",
  "No monthly subscription lock-in — credits never expire",
  "Support for TypeScript, Python, Go, Rust, Java, and 20+ languages",
  "Persistent query and answer memory history",
];

export const PricingSection = () => {
  // Default to 1,000 credits tier (index 3)
  const [sliderIndex, setSliderIndex] = useState<number>(3);

  const selectedTier = CREDIT_TIERS[sliderIndex] ?? CREDIT_TIERS[3];

  return (
    <section id="pricing" className="bg-background scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-3 font-mono text-xs tracking-wider uppercase"
          >
            Fair & Transparent
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Pure Credit-Based Pricing. Zero Subscriptions.
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Every feature is included regardless of volume. Adjust the slider to
            estimate your needs, or get started immediately with 25 free credits
            upon sign-up.
          </p>
        </div>

        {/* Unified Interactive Pricing Card */}
        <div className="mx-auto mt-14 max-w-5xl">
          <Card className="border-border bg-card overflow-hidden shadow-lg">
            <div className="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              {/* Left Column: Interactive Stepped Slider & Price Counter (7 cols) */}
              <div className="flex flex-col justify-between space-y-8 p-6 sm:p-10 lg:col-span-7">
                <div className="space-y-6">
                  {/* Dynamic Pricing Counter Header */}
                  <div className="border-border flex flex-wrap items-end justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                      <span className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
                        Selected Credit Pack
                      </span>
                      <div className="flex items-center gap-2">
                        <RiCoinFill className="text-primary size-6" />
                        <span className="font-heading text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
                          {selectedTier.credits.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-sm font-medium">
                          credits
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="font-heading text-primary text-4xl font-black sm:text-5xl">
                          $
                          {selectedTier.price.toFixed(
                            selectedTier.price % 1 === 0 ? 0 : 2,
                          )}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          one-time
                        </span>
                      </div>
                      <span className="text-2xs text-muted-foreground font-mono">
                        $0.01 / credit
                      </span>
                    </div>
                  </div>

                  {/* Stepped Slider Controls */}
                  <div className="space-y-4 pt-2">
                    <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
                      <span>Choose credit amount:</span>
                      <span className="text-foreground font-mono font-semibold">
                        Step {sliderIndex + 1} of {CREDIT_TIERS.length}
                      </span>
                    </div>

                    <div className="px-1 py-2">
                      <Slider
                        value={[sliderIndex]}
                        onValueChange={(val) => {
                          if (val[0] !== undefined) {
                            setSliderIndex(val[0]);
                          }
                        }}
                        min={0}
                        max={CREDIT_TIERS.length - 1}
                        step={1}
                        aria-label="Credit volume slider"
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Stepped Tick Marks */}
                    <div className="flex justify-between px-1">
                      {CREDIT_TIERS.map((tier, idx) => {
                        const isCurrent = idx === sliderIndex;
                        return (
                          <button
                            key={tier.slug}
                            type="button"
                            onClick={() => setSliderIndex(idx)}
                            className={`flex flex-col items-center transition-all ${
                              isCurrent
                                ? "text-primary scale-110 font-bold"
                                : "text-muted-foreground hover:text-foreground font-medium"
                            }`}
                          >
                            <span className="text-2xs font-mono">
                              {tier.label}
                            </span>
                            <span
                              className={`mt-1 size-1.5 rounded-full ${
                                isCurrent ? "bg-primary" : "bg-border"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Capacity Explanation */}
                  <div className="border-border/70 bg-muted/30 rounded-xl border p-4">
                    <div className="flex items-start gap-2.5">
                      <Zap className="text-primary mt-0.5 size-4 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-foreground text-xs font-semibold">
                          Estimated Capacity:
                        </p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {selectedTier.description}. Credits are deducted upon
                          repo indexing based on file count, and queries cost 1
                          credit each.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="space-y-3 pt-4">
                  <Button
                    size="lg"
                    asChild
                    className="h-12 w-full gap-2 text-sm font-semibold shadow-md"
                  >
                    <Link href="/signup">
                      <Sparkles className="size-4" />
                      <span>Get Started with 25 Free Credits</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <p className="text-2xs text-muted-foreground text-center">
                    No credit card required • Top up anytime • Credits never
                    expire
                  </p>
                </div>
              </div>

              {/* Right Column: Unified Features List (5 cols) */}
              <div className="bg-muted/10 flex flex-col justify-between space-y-6 p-6 sm:p-10 lg:col-span-5">
                <div>
                  <div className="border-border flex items-center justify-between border-b pb-3">
                    <h3 className="font-heading text-foreground text-base font-bold">
                      Included in Every Pack
                    </h3>
                    <Badge variant="secondary" className="text-2xs font-mono">
                      All Features
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    We never gate features or limit query depth behind arbitrary
                    pricing tiers.
                  </p>

                  <ul className="mt-6 space-y-3">
                    {UNIFIED_FEATURES.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-foreground flex items-start gap-2.5 text-xs"
                      >
                        <Check className="text-primary mt-0.5 size-4 shrink-0" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Free Credits Reminder Box */}
                <div className="border-primary/20 bg-primary/5 space-y-1 rounded-lg border p-3.5">
                  <div className="text-primary flex items-center gap-1.5 text-xs font-semibold">
                    <ShieldCheck className="size-3.5" />
                    <span>Free Account Benefit</span>
                  </div>
                  <p className="text-2xs text-muted-foreground leading-relaxed">
                    Signing up grants 25 free credits automatically. You can
                    index your first repository and test semantic queries before
                    purchasing any credit pack.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
