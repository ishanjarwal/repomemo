import z from "zod";

export const NewProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  github_url: z.url("Enter a valid GitHub URL"),
  personal_access_token: z.string(),
});

export type NewProjectFormValues = z.input<typeof NewProjectSchema>;
export type NewProjectFormOutput = z.output<typeof NewProjectSchema>;
