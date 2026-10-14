"use client";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/trpc/react";
import { cn } from "cn";
import { Folder, Lock } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const ProjectListSidebar = () => {
  const {
    data: projects,
    isPending,
    isRefetching,
  } = api.project.getProjects.useQuery();
  const pathname = usePathname();
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : undefined;

  return (
    <>
      {isPending && !isRefetching && (
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      )}
      {projects &&
        projects.map((project, idx) => (
          <SidebarMenuItem key={idx + project.name}>
            <SidebarMenuButton asChild>
              <Link
                className={cn(
                  pathname.startsWith("/project/") &&
                     id === project.id &&
                    "bg-primary hover:bg-primary! text-white hover:text-white!",
                )}
                href={`/project/${project.id}`}
              >
                <Folder />
                <span className="truncate flex-1">{project.name}</span>
                {project.isPrivate && (
                  <span title="Private repository" className="ml-auto flex items-center">
                    <Lock className="size-3 shrink-0 opacity-70" />
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </>
  );
};

export default ProjectListSidebar;
