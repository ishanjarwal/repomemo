import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Folder, Lock } from "lucide-react";
import { ProjectDropdownMenu } from "./ProjectDropdownMenu";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    createdAt: Date | string | number;
    isPrivate?: boolean;
  };
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start space-x-4">
        <Folder className="size-6" />

        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <h1 className="font-bold">{project.name}</h1>
            {project.isPrivate ? (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <Lock className="size-2.5" />
                Private
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">
                Public
              </Badge>
            )}
          </div>

          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(project.createdAt)}
          </span>
        </div>
      </div>

      <ProjectDropdownMenu project={project} />
    </div>
  );
};
