"use client";
import { Skeleton } from "@/components/ui/skeleton";
import CommitLog from "@/features/project/components/CommitLog";
import { ProjectDropdownMenu } from "@/features/project/components/ProjectDropdownMenu";
import { QuestionBox } from "@/features/project/components/QuestionBox";
import { api } from "@/lib/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { Folder } from "lucide-react";
import { useParams } from "next/navigation";

const ProjectPage = () => {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : undefined;

  const {
    data: project,
    isSuccess,
    isPending,
  } = api.project.getProject.useQuery({ id: id as string });

  return (
    <>
      {isPending && (
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex flex-col items-start space-y-2">
            <Skeleton className="h-6 w-50" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="mx-auto w-full space-y-4">
            <Skeleton className="h-60 w-full rounded-xl" />
            <div className="flex justify-start space-x-2">
              <Skeleton className="h-8 w-36 rounded-full" />
              <Skeleton className="h-8 w-42 rounded-full" />
              <Skeleton className="h-8 w-40 rounded-full" />
            </div>
          </div>
        </div>
      )}
      {isSuccess && project && (
        <div className="mx-auto max-w-3xl space-y-8 pt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start space-x-4">
              <Folder className="size-6" />
              <div className="flex flex-col items-start justify-start space-x-2">
                <h1 className="font-bold">{project.name}</h1>
                <span className="text-muted-foreground text-xs">
                  {" "}
                  {formatDistanceToNow(project.createdAt)}
                </span>
              </div>
            </div>
            <div>
              <ProjectDropdownMenu id={project.id} />
            </div>
          </div>
          <QuestionBox
            ownerAvatarUrl={project.owner.avatar_url}
            ownerLogin={project.owner.username}
            repoName={project.repo}
            branch="main"
          />
          <CommitLog id={project.id} />
        </div>
      )}
    </>
  );
};

export default ProjectPage;
