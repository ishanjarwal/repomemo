"use client";

import { useState } from "react";
import {
  Bot,
  Check,
  Code2,
  Copy,
  ExternalLink,
  FileCode,
  GitBranch,
  Layers,
  Loader2,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DemoQuery {
  id: string;
  category: string;
  question: string;
  summary: string;
  explanation: string[];
  sources: {
    file: string;
    lines: string;
    score: number;
    codeSnippet: string;
  }[];
}

const DEMO_QUERIES: DemoQuery[] = [
  {
    id: "auth-hydration",
    category: "Auth Architecture",
    question:
      "How does authentication session refresh and client hydration work?",
    summary:
      "Better-Auth hydrates initial server sessions into React state and synchronizes with cookies across SSR and client navigation.",
    explanation: [
      "Root layout receives the session server-side via `auth.api.getSession` and passes it through to providers.",
      "The client-side `UserButton` hydrates session state using `auth.hydrateSession(initialSession)` to prevent layout shift or hydration mismatch.",
      "Session tokens are indexed in PostgreSQL under the `Session` model with cascade deletion on user removal.",
    ],
    sources: [
      {
        file: "src/lib/auth.ts",
        lines: "13-48",
        score: 96,
        codeSnippet: `export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [oneTap(), polar()]
});`,
      },
      {
        file: "src/features/auth/components/UserButton.tsx",
        lines: "21-36",
        score: 92,
        codeSnippet: `export const UserButton = ({ initialSession }: Props) => {
  auth.hydrateSession(initialSession);
  const { data, isPending } = auth.useSession();
  const session = isPending ? initialSession : data;
  
  if (!session) return null;
  return <Popover>{/* User Profile Dropdown */}</Popover>;
};`,
      },
    ],
  },
  {
    id: "vector-pipeline",
    category: "Vectorization",
    question: "How does RepoMemo index Git files into pgvector embeddings?",
    summary:
      "Inngest steps coordinate cloning, tree walking, filtering, Google GenAI text-embedding generation, and SQL vector storage.",
    explanation: [
      "Background jobs are orchestrated through Inngest functions across 5 distinct stages (`fetching_repo` -> `indexing_files` -> `creating_embeddings`).",
      "Files are cleaned, stripped of binary artifacts, and chunked with AST-aware context.",
      "Google GenAI generates 768-dimensional embeddings stored in the `repo_files` table with pgvector cosine distance indexing.",
    ],
    sources: [
      {
        file: "prisma/schema.prisma",
        lines: "131-144",
        score: 98,
        codeSnippet: `model RepoFile {
  id        String   @id @default(uuid())
  source    String
  summary   String
  embedding Unsupported("vector(768)")
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
}`,
      },
      {
        file: "src/server/inngest/functions/indexRepo.ts",
        lines: "45-72",
        score: 89,
        codeSnippet: `await step.run("create-embeddings", async () => {
  const vectors = await genai.batchEmbedContents({
    model: env.GEMINI_TEXT_MODEL,
    requests: chunks.map(c => ({ text: c.content }))
  });
  await db.$executeRaw\`INSERT INTO repo_files ...\`;
});`,
      },
    ],
  },
  {
    id: "billing-credits",
    category: "Credits & Billing",
    question:
      "How are user credits calculated and deducted when indexing repositories?",
    summary:
      "Credit consumption is proportional to file count and token complexity, verified upfront via a transient ProjectCreateSession.",
    explanation: [
      "When a user selects a repository, an ephemeral `ProjectCreateSession` evaluates the file tree and sets credit requirements (minimum 25 credits).",
      "During final confirmation, credits are deducted inside an atomic Prisma transaction.",
      "Purchased credits via Polar checkouts trigger the `order.created` webhook to replenish user balance instantly.",
    ],
    sources: [
      {
        file: "prisma/schema.prisma",
        lines: "189-208",
        score: 94,
        codeSnippet: `model ProjectCreateSession {
  id          String   @id @default(cuid())
  userId      String
  repoId      String
  fileCount   Int
  credits     Int
  status      ProjectCreateSessionStatus @default(PENDING)
}`,
      },
      {
        file: "src/server/api/routers/project.ts",
        lines: "88-112",
        score: 91,
        codeSnippet: `await ctx.db.$transaction(async (tx) => {
  const userCredits = await tx.credits.findUnique({ where: { userId } });
  if (userCredits.credits < session.credits) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient credits" });
  }
  await tx.credits.update({ ... });
});`,
      },
    ],
  },
];

export const InteractiveDemoSection = () => {
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const activeQuery = DEMO_QUERIES[activeQueryIndex]!;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const handleCopySnippet = (snippet: string, filename: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <section
      id="interactive-demo"
      className="bg-muted/30 border-border/60 scroll-mt-20 border-y py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-3 font-mono text-xs tracking-wider uppercase"
          >
            Hands-On Codebase Explorer
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Ask your codebase anything.
            <br />
            <span className="text-muted-foreground font-normal">
              Get direct architectural truth with file citations.
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Experience how RepoMemo turns git repositories into a responsive
            knowledge engine. Select a sample query below or test how our
            multi-file grounding works in real time.
          </p>
        </div>

        {/* Interactive Workspace Container */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Preset Questions & Repository Selector */}
          <div className="space-y-4 lg:col-span-4">
            <div className="border-border bg-card rounded-xl border p-4 shadow-xs">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="text-primary size-4" />
                  <span className="text-xs font-semibold">
                    Active Demo Target
                  </span>
                </div>
                <Badge variant="secondary" className="font-code text-2xs">
                  Next.js + pgvector
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Indexed repository:{" "}
                <span className="text-foreground font-mono font-medium">
                  ishanjarwal/repomemo
                </span>{" "}
                (145 files, commit sha 94f1c8d)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Select Architectural Scenario
              </label>
              {DEMO_QUERIES.map((query, idx) => {
                const isActive = idx === activeQueryIndex;
                return (
                  <button
                    key={query.id}
                    onClick={() => setActiveQueryIndex(idx)}
                    className={`w-full rounded-lg border p-3.5 text-left transition-all ${
                      isActive
                        ? "border-primary bg-card ring-primary/20 shadow-xs ring-1"
                        : "border-border bg-card/60 hover:bg-card hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xs text-primary font-semibold tracking-wider uppercase">
                        {query.category}
                      </span>
                      <span className="text-2xs text-muted-foreground font-mono">
                        {query.sources.length} citations
                      </span>
                    </div>
                    <p className="text-foreground mt-1 line-clamp-2 text-xs font-medium sm:text-sm">
                      {query.question}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Input Simulation */}
            <form onSubmit={handleCustomSubmit} className="space-y-2 pt-2">
              <label className="text-muted-foreground text-xs font-semibold">
                Or type your own question:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g., Where are Prisma queries logged?"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-xs focus:ring-1 focus:outline-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute top-1 right-1 h-6 px-2 text-xs"
                >
                  {isSimulating ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Search className="size-3" />
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Result Sandbox */}
          <div className="lg:col-span-8">
            <Card className="border-border bg-card h-full shadow-md">
              <CardHeader className="border-border bg-muted/20 border-b pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
                      <Bot className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold sm:text-base">
                        {activeQuery.question}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Grounded with pgvector semantic similarity & code AST
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-2xs gap-1 font-mono">
                    <Sparkles className="text-primary size-3" />
                    Synthesized in 240ms
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <Tabs defaultValue="answer" className="w-full">
                  <TabsList className="mb-4 grid w-full max-w-xs grid-cols-2">
                    <TabsTrigger value="answer" className="text-xs">
                      Architectural Answer
                    </TabsTrigger>
                    <TabsTrigger value="sources" className="text-xs">
                      Cited Source Files ({activeQuery.sources.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Architectural Answer */}
                  <TabsContent
                    value="answer"
                    className="space-y-4 focus-visible:outline-none"
                  >
                    <div className="border-border/80 bg-muted/20 rounded-lg border p-4">
                      <p className="text-foreground text-xs leading-relaxed font-semibold sm:text-sm">
                        {activeQuery.summary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Detailed Execution & Flow Trace
                      </p>
                      <ul className="space-y-2">
                        {activeQuery.explanation.map((item, i) => (
                          <li
                            key={i}
                            className="text-foreground flex items-start gap-2.5 text-xs sm:text-sm"
                          >
                            <span className="bg-primary/10 text-primary text-2xs mt-1 flex size-4 shrink-0 items-center justify-center rounded-full font-bold">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <p className="text-2xs text-muted-foreground mb-2 font-semibold tracking-wider uppercase">
                        Cross-Reference Citations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeQuery.sources.map((source, idx) => (
                          <div
                            key={idx}
                            className="border-border bg-background flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs"
                          >
                            <FileCode className="text-primary size-3.5" />
                            <span className="text-foreground">
                              {source.file}
                            </span>
                            <span className="text-muted-foreground">
                              :{source.lines}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-2xs ml-1 px-1 py-0 font-mono"
                            >
                              {source.score}% match
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab 2: Cited Source Files */}
                  <TabsContent
                    value="sources"
                    className="space-y-4 focus-visible:outline-none"
                  >
                    {activeQuery.sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="border-border bg-background overflow-hidden rounded-lg border"
                      >
                        <div className="border-border bg-muted/40 flex items-center justify-between border-b px-3 py-2 text-xs">
                          <div className="flex items-center gap-2">
                            <FileCode className="text-primary size-3.5" />
                            <span className="text-foreground font-mono font-medium">
                              {source.file}
                            </span>
                            <span className="text-muted-foreground">
                              L{source.lines}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-2xs font-mono"
                            >
                              pgvector similarity: {source.score}%
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6"
                              onClick={() =>
                                handleCopySnippet(
                                  source.codeSnippet,
                                  source.file,
                                )
                              }
                              title="Copy snippet"
                            >
                              {copiedFile === source.file ? (
                                <Check className="text-primary size-3" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <pre className="font-code text-foreground bg-muted/10 overflow-x-auto p-3 text-xs leading-relaxed">
                          <code>{source.codeSnippet}</code>
                        </pre>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
