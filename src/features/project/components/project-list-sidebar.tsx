import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/trpc/react";
import { Folder } from "lucide-react";
import Link from "next/link";

const ProjectListSidebar = () => {
  const { data: projects, status } = api.project.getProjects.useQuery();

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
              <Link href={`/project/${project.id}`}>
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
