"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/react";
import { Coins, GitCommit, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ReindexBannerProps {
  projectId: string;
  changedFilesCount: number;
  estimatedCredits: number;
  onReindexStarted?: () => void;
}

export function ReindexBanner({
  projectId,
  changedFilesCount,
  estimatedCredits,
  onReindexStarted,
}: ReindexBannerProps) {
  const apiUtils = api.useUtils();

  const reindexMutation = api.project.reindex.useMutation({
    onSuccess: async () => {
      toast.success("Reindexing started");
      onReindexStarted?.();
      await apiUtils.project.getJob.refetch();
      await apiUtils.project.getProject.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to start reindexing");
    },
  });

  const handleReindex = () => {
    if (reindexMutation.isPending) return;
    reindexMutation.mutate({ projectId });
  };

  return (
    <Alert className="border-primary/20 bg-primary/5 relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md">
          <GitCommit className="size-4" />
        </div>
        <div className="space-y-1">
          <AlertTitle className="text-foreground text-sm font-semibold">
            A new commit has been detected on this repo, request reindexing to stay updated with context
          </AlertTitle>
          <AlertDescription className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="text-xs font-normal">
              {changedFilesCount} {changedFilesCount === 1 ? "file" : "files"} changed
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs font-normal">
              <Coins className="size-3" />
              {estimatedCredits} {estimatedCredits === 1 ? "credit" : "credits"}
            </Badge>
          </AlertDescription>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          size="sm"
          onClick={handleReindex}
          disabled={reindexMutation.isPending}
          className="gap-2"
        >
          {reindexMutation.isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Requesting...
            </>
          ) : (
            <>
              <RefreshCw className="size-3.5" />
              Request Reindexing
            </>
          )}
        </Button>
      </div>
    </Alert>
  );
}
