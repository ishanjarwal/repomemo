import { env } from "@/env";
import NewProjectForm from "@/features/project/components/new-project-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const NewProjectFormPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="">
      <div>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">New Project</h1>
          <p className="text-muted-foreground text-sm">
            Add a Github Repo URL to link it to {env.NEXT_PUBLIC_APP_NAME}.
          </p>
        </div>
        <div className="pt-8">
          <NewProjectForm />
        </div>
      </div>
    </div>
  );
};

export default NewProjectFormPage;
