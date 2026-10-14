"use client";

import { CreateLoader } from "@/features/project/components/CreateLoader";
import { PreviousAnswersSection } from "@/features/project/components/PreviousAnswersSection";
import { ProjectHeader } from "@/features/project/components/ProjectHeader";
import { ProjectSkeleton } from "@/features/project/components/ProjectSkeleton";
import { QuestionBox } from "@/features/project/components/QuestionBox";
import { ReindexBanner } from "@/features/project/components/ReindexBanner";
import { ReindexLoader } from "@/features/project/components/ReindexLoader";
import { api } from "@/lib/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProjectViewProps {
  id: string;
}

export const ProjectView = ({ id }: ProjectViewProps) => {
  const router = useRouter();

  const [showLoader, setShowLoader] = useState(false);

  // First query on page load.
  // This tells us whether ingestion is already complete.
  const projectQuery = api.project.getProject.useQuery({ id });

  const project = projectQuery.data;
  const jobStatus = project?.jobStatus;

  /*
   * Once the project query tells us that ingestion is required,
   * enable the ingestion query.
   */
  const ingestionQuery = api.project.getJob.useQuery(
    { projectId: id },
    {
      enabled:
        projectQuery.isSuccess &&
        jobStatus !== undefined &&
        jobStatus !== "ready",

      // Continue polling until ingestion finishes.
      refetchInterval: (query) => {
        const status = query.state.data?.status;

        if (status === "ready" || status === "failed") {
          return false;
        }

        return 1000;
      },
    },
  );

  const currentStatus = ingestionQuery.data?.status ?? jobStatus;
  const isReindexing = currentStatus === "reindexing" || jobStatus === "reindexing";

  /*
   * Decide whether CreateLoader or ReindexLoader should be displayed.
   *
   * We only show it when the initial project query says
   * that ingestion or reindexing is required.
   */
  useEffect(() => {
    if (!projectQuery.isSuccess) return;

    if (jobStatus === "ready") {
      setShowLoader(false);
      return;
    }

    setShowLoader(true);
  }, [projectQuery.isSuccess, jobStatus]);

  /*
   * When ingestion or reindexing becomes ready:
   *
   * 1. Keep loader visible for 2 seconds.
   * 2. Remove it.
   * 3. Refetch the project.
   *
   * The project query will now contain jobStatus === "ready".
   */
  useEffect(() => {
    if (ingestionQuery.data?.status !== "ready") return;

    const timeout = setTimeout(async () => {
      setShowLoader(false);

      await projectQuery.refetch();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [ingestionQuery.data?.status]);

  // Handle ingestion / reindexing failure.
  useEffect(() => {
    if (ingestionQuery.data?.status !== "failed") return;

    if (isReindexing) {
      toast.error("Reindexing failed");
      setShowLoader(false);
      void projectQuery.refetch();
    } else {
      toast.error("Something went wrong");
      router.push("/dashboard");
    }
  }, [ingestionQuery.data?.status, isReindexing, router]);

  // Initial project query.
  if (projectQuery.isPending) {
    return <ProjectSkeleton />;
  }

  // Loader is required and is running.
  if (showLoader) {
    if (isReindexing) {
      return (
        <div className="flex items-center justify-center py-16">
          <ReindexLoader
            progress={ingestionQuery.data?.progress ?? 0}
            status={currentStatus}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center py-16">
        <CreateLoader
          progress={ingestionQuery.data?.progress ?? 0}
          status={currentStatus ?? "queued"}
        />
      </div>
    );
  }

  // After loader disappears, project is being refetched.
  if (projectQuery.isFetching || !project) {
    return <ProjectSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-12">
      <ProjectHeader project={project} />

      {project.reindexRequest && currentStatus === "ready" && (
        <ReindexBanner
          projectId={id}
          changedFilesCount={project.changedFilesCount}
          estimatedCredits={project.estimatedCredits}
          onReindexStarted={() => {
            setShowLoader(true);
          }}
        />
      )}

      <QuestionBox
        projectId={id}
        ownerAvatarUrl={project.owner.avatar_url}
        ownerLogin={project.owner.username}
        repoName={project.repo}
        suggestedQueries={project.suggestedQueries}
        branch="main"
        isPrivate={project.isPrivate}
      />

      <PreviousAnswersSection projectId={id} />
    </div>
  );
};
