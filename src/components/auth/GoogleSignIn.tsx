"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth-client";
import { toast } from "sonner";

const GoogleSignIn = () => {
  const signIn = async () => {
    await auth.signIn.social(
      {
        provider: "google",
        callbackURL: "/dashboard",
      },
      {
        onError(context) {
          toast.error(context.error.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <Button onClick={signIn} type="button" variant="outline" className="h-11">
      <FcGoogle />
      Continue with Google
    </Button>
  );
};

export default GoogleSignIn;
