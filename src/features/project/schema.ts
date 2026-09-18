import z from "zod";

export const NewProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200, "Name too long"),
  github_url: z
    .url("Enter a valid URL")
    .regex(
      /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/,
      "Enter a valid GitHub repository URL",
    ),
  personal_access_token: z.string(),
});

export type NewProjectFormValues = z.input<typeof NewProjectSchema>;
export type NewProjectFormOutput = z.output<typeof NewProjectSchema>;
