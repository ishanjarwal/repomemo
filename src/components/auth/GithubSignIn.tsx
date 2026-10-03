"use client";
import { auth } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "../ui/button";

const GithubSignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const signIn = async () => {
    await auth.signIn.social(
      {
        provider: "github",
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
          <FaGithub />
          Continue with Github
        </>
      )}
    </Button>
  );
};

export default GithubSignIn;
