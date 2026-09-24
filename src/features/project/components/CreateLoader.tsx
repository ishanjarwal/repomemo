"use client";

import {
  Check,
  Database,
  FileCode2,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { ProjectJobStatusEnum } from "../../../../generated/prisma/enums";
import { Badge } from "@/components/ui/badge";

type Step = {
  id: ProjectJobStatusEnum;
  title: string;
  description: string;
  icon: React.ElementType;
};

const STEPS: Step[] = [
  {
    id: "fetching_repo",
    title: "Fetching repository",
    description: "Reading files from your GitHub repository",
    icon: FaGithub,
  },
  {
    id: "indexing_files",
    title: "Indexing files",
    description: "Splitting source code into searchable chunks",
    icon: FileCode2,
  },
  {
    id: "creating_embeddings",
    title: "Creating embeddings",
    description: "Converting code and documentation into vectors",
    icon: Sparkles,
  },
  {
    id: "building_vector_index",
    title: "Building vector index",
    description: "Making your repository ready for semantic search",
    icon: Database,
  },
];

type StatusEnum = "complete" | "active" | "pending";

const StepIcon = ({
  status,
  icon: Icon,
}: {
  status: StatusEnum;
  icon: React.ElementType;
}) => {
  if (status === "complete") {
    return (
      <div className="bg-primary text-primary-foreground relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full">
        <Check className="size-4" />
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="border-primary bg-background text-primary relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-muted text-muted-foreground relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border">
      <Icon className="size-4" />
    </div>
  );
};

const StatusPill = ({ status }: { status: ProjectJobStatusEnum }) => {
  if (status === "ready") {
    return (
      <Badge variant={"secondary"} className="bg-green-400/10 text-green-400">
        <Check className="size-3" />
        Ready
      </Badge>
    );
  } else if (status === "failed") {
    return (
      <Badge variant={"secondary"} className="bg-red-400/10 text-red-400">
        <X className="size-3" />
        Failed
      </Badge>
    );
  } else {
    return (
      <Badge variant={"secondary"} className="bg-yellow-400/10 text-yellow-400">
        <Loader2 className="size-3 animate-spin" />
        Setting up
      </Badge>
    );
  }
};

export function CreateLoader({
  status,
  progress,
}: {
  status: ProjectJobStatusEnum;
  progress: number;
}) {
  const activeStep =
    status === "queued"
      ? 0
      : status === "ready"
        ? STEPS.length
        : status === "failed"
          ? -1
          : STEPS.findIndex((step) => step.id === status);

  return (
    <Card className="bg-background w-full max-w-xl overflow-hidden">
      <CardHeader className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg border">
              <FaGithub className="size-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base">
                Preparing your repository
              </CardTitle>

              <p className="text-muted-foreground mt-1 text-sm">
                We&apos;re making your code searchable with AI.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <StatusPill status={status} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Repository ingestion</span>

            <span className="font-medium tabular-nums">{progress}%</span>
          </div>

          <Progress value={progress} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="space-y-6">
          {STEPS.map((step, index) => {
            const isComplete = index < activeStep;
            const isActive = activeStep === index;
            const isPending = index > activeStep;

            return (
              <div key={step.id} className="relative flex gap-3">
                {index < STEPS.length - 1 && (
                  <div
                    className={[
                      "absolute top-8 left-4 h-6 w-px",
                      index < activeStep ? "bg-primary" : "bg-border",
                    ].join(" ")}
                  />
                )}

                <StepIcon
                  status={
                    isComplete ? "complete" : isActive ? "active" : "pending"
                  }
                  icon={step.icon}
                />

                <div className="min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p
                      className={
                        isPending
                          ? "text-muted-foreground text-sm font-medium"
                          : "text-foreground text-sm font-medium"
                      }
                    >
                      {step.title}
                    </p>
                  </div>

                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-2 px-3 py-2.5">
          <Search className="text-muted-foreground mt-0.5 size-4 shrink-0" />

          <p className="text-muted-foreground text-xs">
            You&apos;ll be able to ask questions about your code once indexing
            is complete.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
