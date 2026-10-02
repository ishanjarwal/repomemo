"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import GithubSignIn from "@/components/auth/GithubSignIn";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { auth } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, apostrophes, and hyphens",
    ),

  email: z.email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    await auth.signUp.email(
      {
        ...values,
      },
      {
        onSuccess() {
          toast.success(
            "Verification email has been sent. Please check you inbox.",
          );
          router.push("/");
        },
        onError(context) {
          toast.error(context.error.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <Card className="bg-transparent p-0 ring-0 outline-0">
      <CardHeader className="pb-7">
        <CardTitle className="text-3xl tracking-tight">
          Create your account
        </CardTitle>

        <CardDescription className="mt-2">
          Start exploring your repositories with AI.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* OAuth */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <GoogleSignIn />
              <GithubSignIn />
            </div>

            <FieldSeparator className="my-2">
              Or continue with email
            </FieldSeparator>

            {/* Name */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>

                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldDescription className="text-xs">
                    At least 8 characters with uppercase, lowercase, number, and
                    special character.
                  </FieldDescription>

                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Button
              type="submit"
              className="mt-2 h-11 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Creating account..."
                : "Create account"}
            </Button>

            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-foreground font-medium underline underline-offset-4"
              >
                Sign in
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
