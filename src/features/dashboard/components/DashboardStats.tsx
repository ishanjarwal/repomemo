"use client";

import Link from "next/link";
import { FolderGit2, Plus, Sparkles } from "lucide-react";
import { RiCoinFill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/trpc/react";

interface DashboardStatsProps {
  onAddCredits: () => void;
}

export const DashboardStats = ({ onAddCredits }: DashboardStatsProps) => {
  const { data: credits, isPending: isCreditsPending } =
    api.billing.getAvailableCredits.useQuery();

  const { data: projects, isPending: isProjectsPending } =
    api.project.getProjects.useQuery();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Available Credits Card */}
      <Card className="relative overflow-hidden transition-all hover:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Available Credits
            </CardTitle>
            <CardDescription className="text-xs">
              Powers repository indexing and AI queries
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <RiCoinFill className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight tabular-nums">
              {isCreditsPending ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                (credits?.toLocaleString() ?? 0)
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddCredits}
              className="gap-1.5 font-medium"
            >
              <Plus className="size-3.5" />
              <span>Add Credits</span>
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            {isCreditsPending
              ? "Checking balance..."
              : (credits ?? 0) <= 25
                ? "Low balance. Top up to index larger repositories."
                : "Sufficient balance for repository ingestion & questions."}
          </p>
        </CardContent>
      </Card>

      {/* Active Repositories Card */}
      <Card className="relative overflow-hidden transition-all hover:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Active Repositories
            </CardTitle>
            <CardDescription className="text-xs">
              GitHub repositories linked to your account
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <FolderGit2 className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight tabular-nums">
              {isProjectsPending ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                (projects?.length ?? 0)
              )}
            </div>
            <Button size="sm" asChild className="gap-1.5 font-medium">
              <Link href="/new-project">
                <Plus className="size-3.5" />
                <span>New Project</span>
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            {isProjectsPending
              ? "Loading projects..."
              : (projects?.length ?? 0) === 0
                ? "No repositories connected yet."
                : `${projects?.length} ${projects?.length === 1 ? "project" : "projects"} indexed with vector embeddings.`}
          </p>
        </CardContent>
      </Card>

      {/* AI Intelligence Card */}
      <Card className="relative overflow-hidden transition-all hover:shadow-sm sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Knowledge Engine
            </CardTitle>
            <CardDescription className="text-xs">
              Gemini vector embeddings & RAG search
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Sparkles className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-primary flex size-2 animate-pulse rounded-full" />
              <span className="text-sm font-semibold">Online & Ready</span>
            </div>
            <span className="text-muted-foreground bg-muted rounded-md px-2 py-0.5 font-mono text-xs">
              768-dim
            </span>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Semantic code parsing extracts file summaries and enables contextual
            Q&amp;A.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
