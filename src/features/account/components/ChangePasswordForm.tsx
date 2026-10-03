"use client";

import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChangePasswordFormValues, changePasswordSchema } from "../schema";
const ChangePasswordForm = () => {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    await auth.changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onError(context) {
          toast.error(context.error.message || "Something went wrong");
        },
        onSuccess(context) {
          toast.success("Password changed successfully");
        },
      },
    );
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        control={form.control}
        name="currentPassword"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
            <Input
              {...field}
              id="currentPassword"
              type="password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="newPassword"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="newPassword">{"New password"}</FieldLabel>
            <Input
              {...field}
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription>Use at least 8 characters.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              {...field}
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && (
          <Loader2 className="size-4 animate-spin" />
        )}
        Change Password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
