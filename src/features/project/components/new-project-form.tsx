"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/trpc/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  NewProjectFormOutput,
  NewProjectFormValues,
  NewProjectSchema,
} from "../schema";
import { useRouter } from "next/navigation";

const NewProjectForm = () => {
  const router = useRouter();

  const form = useForm<NewProjectFormValues, unknown, NewProjectFormOutput>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      name: "",
      github_url: "",
      personal_access_token: "",
    },
  });

  const apiUtils = api.useUtils();
  const createProject = api.project.createProject.useMutation();

  const onSubmit = (values: NewProjectFormOutput) => {
    createProject.mutate(values, {
      onSuccess: async ({ id }) => {
        await apiUtils.project.getProjects.invalidate();
        toast.success("Project Created");
        form.reset();
        router.push(`/project/${id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-xl space-y-6"
      autoComplete="off"
    >
      <FieldGroup>
        {/* Project name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-name">Project name</FieldLabel>

              <Input
                {...field}
                id="project-name"
                placeholder="My awesome project"
                aria-invalid={fieldState.invalid}
                className="placeholder:text-muted-foreground"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* GitHub URL */}
        <Controller
          name="github_url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="github-url">GitHub repository</FieldLabel>

              <Input
                {...field}
                id="github-url"
                type="url"
                placeholder="https://github.com/username/repository"
                aria-invalid={fieldState.invalid}
                className="placeholder:text-muted-foreground"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Private token */}
        <Controller
          name="personal_access_token"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="personal-access-token">
                Personal Access Token (Optional)
              </FieldLabel>

              <Input
                {...field}
                id="personal-access-token"
                type="text"
                placeholder="ghp_••••••••••••"
                aria-invalid={fieldState.invalid}
                className="placeholder:text-muted-foreground"
              />

              <FieldDescription className="text-xs">
                Your GitHub personal access token is used to access a private
                repository.
              </FieldDescription>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={createProject.isPending}>
        {createProject.isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Creating...
          </>
        ) : (
          "Create project"
        )}
      </Button>
    </form>
  );
};

export default NewProjectForm;
