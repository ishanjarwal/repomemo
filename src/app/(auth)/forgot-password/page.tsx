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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth-client";
import { toast } from "sonner";
import { env } from "@/env";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    await auth.requestPasswordReset(
      {
        email: values.email,
        redirectTo: `${env.NEXT_PUBLIC_ORIGIN}/reset-password`,
      },
      {
        onSuccess() {
          toast.success("Password reset email has been sent to your email.");
          router.push("/");
        },
        onError(context) {
          toast.error(context.error.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <Card className="p bg-transparent ring-0 outline-0">
      <CardHeader className="pb-7">
        <CardTitle className="text-3xl tracking-tight">
          Recover your account
        </CardTitle>
        <CardDescription className="mt-2">
          Enter your registered email to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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

            <Button
              type="submit"
              className="mt-2 h-11 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Sending" : "Send"}
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
