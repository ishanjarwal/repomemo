"use client";

import { auth } from "@/lib/auth-client";

import PasswordForm from "@/features/account/components/PasswordForm";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileForm from "@/features/account/components/ProfileForm";

const AccountPage = () => {
  const { data: session, isPending } = auth.useSession();

  const user = session?.user;

  if (isPending) {
    return (
      <main className="container max-w-3xl py-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-72" />
        </div>

        <div className="mt-8 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="container max-w-3xl py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your profile and account security.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Profile */}
        <ProfileForm user={user} />

        {/* Password Form */}
        <PasswordForm />
      </div>
    </main>
  );
};

export default AccountPage;
