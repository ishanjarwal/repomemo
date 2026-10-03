import PasswordForm from "@/features/account/components/PasswordForm";
import ProfileForm from "@/features/account/components/ProfileForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const AccountPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/login");
  }

  const user = session.user;

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
