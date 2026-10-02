"use client";

import { auth } from "@/lib/auth-client";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    await auth.signOut({
      callbackURL: "/login",
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant={"destructive"}
      className="group-data-[state=collapsed]:space-x-0"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <LogOut />
          <span className="group-data-[state=collapsed]:hidden">Log out</span>
        </>
      )}
    </Button>
  );
};

export default LogoutButton;
