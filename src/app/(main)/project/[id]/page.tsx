"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CreateLoader } from "@/features/project/components/CreateLoader";
import { ProjectDropdownMenu } from "@/features/project/components/ProjectDropdownMenu";
import { QuestionBox } from "@/features/project/components/QuestionBox";
import { api } from "@/lib/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { Folder } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProjectPage = () => {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : undefined;

  const [showLoader, setShowLoader] = useState(false);

  if (!id) return null;

  // First query on page load.
  // This tells us whether ingestion is already complete.
  const projectQuery = api.project.getProject.useQuery(
    { id },
    {
      enabled: !!id,
    },
  );

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

  /*
   * Decide whether CreateLoader should be displayed.
   *
   * We only show it when the initial project query says
   * that ingestion is required.
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
   * When ingestion becomes ready:
   *
   * 1. Keep CreateLoader visible for 2 seconds.
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

  // Handle ingestion failure.
  useEffect(() => {
    if (ingestionQuery.data?.status !== "failed") return;

    toast.error("Something went wrong");
    router.push("/dashboard");
  }, [ingestionQuery.data?.status, router]);

  // Initial project query.
  if (projectQuery.isPending) {
    return <ProjectSkeleton />;
  }

  // Ingestion is required and is running.
  if (showLoader) {
    return (
      <div className="flex items-center justify-center py-16">
        <CreateLoader
          progress={ingestionQuery.data?.progress ?? 0}
          status={ingestionQuery.data?.status ?? "queued"}
        />
      </div>
    );
  }

  // After CreateLoader disappears, project is being refetched.
  if (projectQuery.isFetching || !project) {
    return <ProjectSkeleton />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start space-x-4">
          <Folder className="size-6" />

          <div className="flex flex-col items-start">
            <h1 className="font-bold">{project.name}</h1>

            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(project.createdAt)}
            </span>
          </div>
        </div>

        <ProjectDropdownMenu id={project.id} />
      </div>

      <QuestionBox
        ownerAvatarUrl={project.owner.avatar_url}
        ownerLogin={project.owner.username}
        repoName={project.repo}
        branch="main"
      />

      {/* <CommitLog id={project.id} /> */}
    </div>
  );
};

const ProjectSkeleton = () => (
  <div className="mx-auto max-w-3xl space-y-4 pt-12">
    <div className="flex flex-col items-start space-y-2">
      <Skeleton className="h-6 w-50" />
      <Skeleton className="h-6 w-36" />
    </div>

    <div className="space-y-4">
      <Skeleton className="h-60 w-full rounded-xl" />

      <div className="flex justify-start space-x-2">
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-8 w-42 rounded-full" />
        <Skeleton className="h-8 w-40 rounded-full" />
      </div>
    </div>
  </div>
);

export default ProjectPage;
