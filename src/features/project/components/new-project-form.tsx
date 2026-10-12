"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, FolderGit2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/trpc/react";

import { FaGithub } from "react-icons/fa";
import {
  NewProjectFormOutput,
  NewProjectFormValues,
  NewProjectSchema,
} from "../schema";
import CreateProjectConfirmation from "./CreateProjectConfirmation";

const NewProjectForm = () => {
  const router = useRouter();

  const form = useForm<NewProjectFormValues, unknown, NewProjectFormOutput>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      name: "",
      github_url: "",
    },
  });

  const apiUtils = api.useUtils();

  const preCreate = api.project.preCreate.useMutation();

  const onSubmit = async (values: NewProjectFormOutput) => {
    preCreate.mutate(values, {
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div>
      {preCreate.isSuccess ? (
        <CreateProjectConfirmation {...preCreate.data} />
      ) : (
        <Card className="bg-background">
          <CardHeader>
            <div className="bg-muted/50 mb-2 flex size-10 items-center justify-center rounded-lg border">
              <FolderGit2 className="size-5" />
            </div>

            <CardTitle>Create a project</CardTitle>

            <CardDescription>
              Connect a GitHub repository to start analyzing your codebase.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Project name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="project-name">
                        Project name
                      </FieldLabel>

                      <Input
                        {...field}
                        id="project-name"
                        placeholder="My awesome project"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* GitHub repository */}
                <Controller
                  name="github_url"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="github-url">
                        GitHub repository
                      </FieldLabel>

                      <div className="relative">
                        <FaGithub className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

                        <Input
                          {...field}
                          id="github-url"
                          type="url"
                          placeholder="https://github.com/username/repository"
                          aria-invalid={fieldState.invalid}
                          className="pl-9"
                        />
                      </div>

                      <FieldDescription>
                        We&apos;ll inspect the repository before creating the
                        project.
                      </FieldDescription>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={preCreate.isPending}
                >
                  {preCreate.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Checking repository...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight />
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewProjectForm;
