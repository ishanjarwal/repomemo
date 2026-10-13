"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Check,
  GitBranch,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api, RouterOutputs } from "@/lib/trpc/react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import {
  ProjectConfirmationOutput,
  ProjectConfirmationSchema,
  ProjectConfirmationValues,
} from "../schema";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = RouterOutputs["project"]["preCreate"];

const CreateProjectConfirmation = ({
  create_session_id,
  projectName,
  credits,
  repository,
}: Props) => {
  const router = useRouter();
  const apiUtils = api.useUtils();

  const form = useForm<
    ProjectConfirmationValues,
    unknown,
    ProjectConfirmationOutput
  >({
    resolver: zodResolver(ProjectConfirmationSchema),
    defaultValues: {
      create_session_id: "",
      personal_access_token: "",
    },
  });

  const createProject = api.project.createProject.useMutation();

  const handleSubmit = (values: ProjectConfirmationOutput) => {
    createProject.mutate(values, {
      onSuccess: (id) => {
        toast.success("Project queued");
        apiUtils.project.getProjects.invalidate();
        apiUtils.billing.getAvailableCredits.invalidate();
        router.push(`/project/${id}`);
      },
      onError(error) {
        toast.error(error.message);
      },
    });
  };

  useEffect(() => {
    form.setValue("create_session_id", create_session_id);
  }, [create_session_id]);

  return (
    <Card className="bg-background">
      <CardHeader>
        <div className="bg-muted/50 mb-2 flex size-10 items-center justify-center rounded-lg border">
          <ShieldCheck className="size-5" />
        </div>

        <CardTitle>{projectName}</CardTitle>

        <CardDescription>
          Review the repository details before creating your project.
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-6">
          <div className="rounded-lg border">
            <div className="flex items-start gap-3 p-4">
              {repository.avatar_url ? (
                <Avatar className="size-8">
                  <AvatarImage src={repository.avatar_url} />
                </Avatar>
              ) : (
                <FaGithub className="size-8" />
              )}

              <div className="min-w-0 flex-1">
                <Link
                  href={`https://github.com/${repository.owner}/${repository.repo}`}
                  className="truncate font-medium"
                >
                  {repository.owner}/{repository.repo}
                </Link>

                {repository.description && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {repository.description}
                  </p>
                )}
              </div>

              <Badge variant="secondary">
                {repository.isPrivate ? (
                  <>
                    <Lock />
                    Private
                  </>
                ) : (
                  "Public"
                )}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 divide-x">
              <div className="p-4">
                <p className="text-muted-foreground text-xs">Default branch</p>

                <div className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <GitBranch className="text-muted-foreground size-4" />
                  {repository.defaultBranch}
                </div>
              </div>

              <div className="p-4">
                <p className="text-muted-foreground text-xs">Project credits</p>

                <p className="mt-1 text-sm font-medium">{credits} credits</p>
              </div>
            </div>
          </div>

          {/* Private repository token */}
          {repository.isPrivate && (
            <Controller
              name="personal_access_token"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="personal-access-token">
                    GitHub Personal Access Token
                  </FieldLabel>

                  <Input
                    {...field}
                    id="personal-access-token"
                    type="password"
                    placeholder="Enter your GitHub token"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldDescription>
                    Required to access this private repository.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          {/* Credit confirmation */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Ready to create</p>

                <p className="text-muted-foreground mt-1 text-sm">
                  Credits are estimated based on the size of the project.
                </p>
              </div>

              <Badge variant="outline">{credits} credits</Badge>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="sm:flex-1"
              disabled={createProject.isPending}
            >
              <ArrowLeft />
              Back
            </Button>

            <Button
              type="submit"
              className="sm:flex-2"
              disabled={createProject.isPending}
            >
              {createProject.isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Use {credits} Credits and Create the Project
                  <Check />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export default CreateProjectConfirmation;
