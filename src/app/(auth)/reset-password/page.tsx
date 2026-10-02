"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const resetPasswordSchema = z
  .object({
    newPassword: z
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Highlights the error on the confirmation field
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const isInvalid = searchParams.get("error");

  if (!token || isInvalid) {
    toast.error("Session expired. Please try again later.");
    return router.push("/");
  }

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    await auth.resetPassword(
      {
        newPassword: values.confirmPassword,
        token,
      },
      {
        onSuccess() {
          toast.success("Password reset successfully");
          router.push("/login");
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
          Reset your password
        </CardTitle>
        <CardDescription className="mt-2">
          Enter a new password for your account
        </CardDescription>
      </CardHeader>

      <CardContent className="">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* New Password */}
            <Controller
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="newPassword">New Password</FieldLabel>

                    <Input
                      {...field}
                      id="newPassword"
                      type="password"
                      placeholder=""
                      aria-invalid={fieldState.invalid}
                    />

                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                );
              }}
            />

            {/* Confirm password */}
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>

                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder=""
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
              {form.formState.isSubmitting ? "Saving..." : "Confirm"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
