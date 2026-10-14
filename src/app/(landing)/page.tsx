import { Metadata } from "next";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  Navbar,
  HeroSection,
  ProblemStorySection,
  InteractiveDemoSection,
  HowItWorksSection,
  UseCasesSection,
  ComparisonSection,
  PricingSection,
  FAQSection,
  CTASection,
  Footer,
} from "@/features/landing/sections";

export const metadata: Metadata = {
  title: "RepoMemo — Understand Any Codebase in Minutes",
  description:
    "AI-powered repository intelligence and RAG for developers. Turn 50,000 lines of complex code into verified architectural answers with line-level file citations.",
};

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="bg-background text-foreground selection:bg-primary/20 selection:text-primary flex min-h-screen flex-col antialiased">
      <Navbar user={session?.user} />

      <main className="flex-1">
        <HeroSection user={session?.user} />
        <ProblemStorySection />
        <InteractiveDemoSection />
        <HowItWorksSection />
        <UseCasesSection />
        <ComparisonSection />
        <PricingSection />
        <FAQSection />
        <CTASection user={session?.user} />
      </main>

      <Footer />
    </div>
  );
}
