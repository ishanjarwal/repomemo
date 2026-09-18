"use client";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/trpc/react";
import { cn } from "cn";
import { Check, Folder } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const ProjectListSidebar = () => {
  const { data: projects, status } = api.project.getProjects.useQuery();
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
      {status === "pending" && (
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      )}
      {status === "success" &&
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
                <span>{project.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </>
  );
};

export default ProjectListSidebar;
