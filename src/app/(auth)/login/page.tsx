"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

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
import GithubSignIn from "@/features/auth/components/GithubSignIn";
import GoogleSignIn from "@/features/auth/components/GoogleSignIn";
import { LoginFormValues, loginSchema } from "@/features/auth/schema";
import { auth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await auth.signIn.email(
      {
        ...values,
        callbackURL: "/dashboard",
      },
      {
        onError(context) {
          if (context.error.status === 403) {
            toast.error("Please verify you account");
            router.push("/");
          } else {
            toast.error(context.error.message || "Something went wrong");
          }
        },
      },
    );
  };

  return (
    <Card className="p bg-transparent ring-0 outline-0">
      <CardHeader className="pb-7">
        <CardTitle className="text-3xl tracking-tight">Welcome back</CardTitle>
        <CardDescription className="mt-2">
          Sign in to continue to your workspace.
        </CardDescription>
      </CardHeader>

      <CardContent className="">
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

            {/* Email */}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => {
                return (
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
                );
              }}
            />

            {/* Password */}

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>

                      <Link
                        href="/forgot-password"
                        className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />

                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                );
              }}
            />

            <Button
              type="submit"
              className="mt-2 h-11 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <FieldDescription className="text-center">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-foreground font-medium underline underline-offset-4"
              >
                Create one
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
