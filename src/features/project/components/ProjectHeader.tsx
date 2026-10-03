import { formatDistanceToNow } from "date-fns";
import { Folder } from "lucide-react";
import { ProjectDropdownMenu } from "./ProjectDropdownMenu";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    createdAt: Date | string | number;
  };
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
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

      <ProjectDropdownMenu project={project} />
    </div>
  );
};
