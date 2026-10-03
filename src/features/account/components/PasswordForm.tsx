"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth-client";
import { useCallback, useEffect, useState } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import SetPasswordForm from "./SetPasswordForm";

const PasswordForm = () => {
  const [hasPassword, setHasPassword] = useState<boolean>(true);

  const verifyPasswordStatus = useCallback(async () => {
    const { data: accounts } = await auth.listAccounts();
    if (accounts) {
      setHasPassword(
        accounts.some((account) => account.providerId === "credential"),
      );
    }
  }, []);

  useEffect(() => {
    verifyPasswordStatus();
  }, [verifyPasswordStatus]);

  return (
    <Card className="ring-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div>
            <CardTitle>{hasPassword ? "Security" : "Set a password"}</CardTitle>
            <CardDescription>
              {hasPassword
                ? "Manage your account password."
                : "Your account was created using a third party identity provider. You can set a password to login normally through your email next time."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {hasPassword ? (
          <ChangePasswordForm />
        ) : (
          <SetPasswordForm refetchPasswordStatus={verifyPasswordStatus} />
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordForm;
