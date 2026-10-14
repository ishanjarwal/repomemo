"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Check, GitCommit, Loader2, Sparkles, X } from "lucide-react";
import * as React from "react";

interface ReindexLoaderProps {
  progress: number;
  status?: string;
}

export function ReindexLoader({ progress, status = "reindexing" }: ReindexLoaderProps) {
  return (
    <Card className="bg-background w-full max-w-xl overflow-hidden shadow-sm">
      <CardHeader className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg border">
              <GitCommit className="size-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base font-semibold">
                Reindexing repository
              </CardTitle>

              <p className="text-muted-foreground mt-1 text-sm">
                Updating AI context and embeddings with recent repository changes.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {status === "ready" ? (
              <Badge variant="secondary" className="bg-green-400/10 text-green-400">
                <Check className="size-3" />
                Updated
              </Badge>
            ) : status === "failed" ? (
              <Badge variant="secondary" className="bg-red-400/10 text-red-400">
                <X className="size-3" />
                Failed
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-blue-400/10 text-blue-400">
                <Loader2 className="size-3 animate-spin" />
                Reindexing
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Incremental sync progress</span>
            <span className="font-medium tabular-nums">{progress}%</span>
          </div>

          <Progress value={progress} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="border-primary bg-background text-primary flex size-7 shrink-0 items-center justify-center rounded-full border">
              <Sparkles className="size-3.5" />
            </div>
            <div>
              <p className="text-foreground text-sm font-medium">
                Synchronizing changed files
              </p>
              <p className="text-muted-foreground text-xs">
                Removing obsolete embeddings and updating summaries for modified files.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
