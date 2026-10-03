"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const GoogleSignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const signIn = async () => {
    await auth.signIn.social(
      {
        provider: "google",
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError(context) {
          toast.error(context.error.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <Button
      disabled={loading}
      onClick={signIn}
      type="button"
      variant="outline"
      className="h-11"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <FcGoogle />
          Continue with Google
        </>
      )}
    </Button>
  );
};

export default GoogleSignIn;
