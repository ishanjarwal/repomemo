import { ProjectView } from "@/features/project/components/ProjectView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/login");
  }

  const { id } = await params;

  return <ProjectView id={id} />;
};

export default ProjectPage;
