"use client";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SetPasswordFormValues, setPasswordSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/trpc/react";
import { toast } from "sonner";
import { auth } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

const SetPasswordForm = ({
  refetchPasswordStatus,
}: {
  refetchPasswordStatus: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const setPasswordMutation = api.account.setPassword.useMutation();

  const onSubmit = async (values: SetPasswordFormValues) => {
    setPasswordMutation.mutate(
      { newPassword: values.newPassword },
      {
        onError: (error) => {
          toast.error(error.message || "Something went wrong");
        },
        onSuccess: () => {
          refetchPasswordStatus();
          toast.success("Password for this account was set.");
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
      }}
    >
      <DialogTrigger asChild>
        <Button>Set a Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set an Account Password</DialogTitle>
          <DialogDescription>
            You will be able to login to your account with your email and a
            password.
          </DialogDescription>
          <div className="py-6">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="newPassword">
                        {"New password"}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        Use at least 8 characters.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </div>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end space-x-2">
          <Button
            disabled={setPasswordMutation.isPending}
            variant={"secondary"}
          >
            Cancel
          </Button>
          <Button
            disabled={setPasswordMutation.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {setPasswordMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetPasswordForm;
