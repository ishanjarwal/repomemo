"use client";

import { format } from "date-fns";
import { Loader2, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "better-auth";
import { toast } from "sonner";
import { ProfileFormValues, profileSchema } from "../schema";

const ProfileForm = ({ user }: { user: User }) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const onSubmit = async (values: ProfileFormValues) => {
    if (user.name === values.name) return;
    await auth.updateUser(
      {
        name: values.name,
      },
      {
        onError(context) {
          toast.error(context.error.message || "Something went wrong");
        },
        onSuccess(context) {
          toast.success("Changes saved.");
          form.resetDefaultValues({ name: values.name });
        },
      },
    );

    // * Refresh the Better Auth session so the rest of the application immediately receives the updated name.
    await auth.getSession();
  };

  return (
    <Card className="ring-0">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your personal account information.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            {user.image && (
              <AvatarImage src={user.image} alt={`${user.name}'s profile`} />
            )}
            <AvatarFallback className="text-lg">
              {initials || <UserRound />}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Joined</p>
            <p className="text-muted-foreground text-sm">
              {format(new Date(user.createdAt), "PPP")}
            </p>
          </div>
        </div>

        <Separator />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  placeholder="Your name"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  This name will be displayed throughout the application.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
