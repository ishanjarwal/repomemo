"use client";

import { useEffect } from "react";
import { auth } from "@/lib/auth-client";

type Props = {
  initialSession: typeof auth.$Infer.Session | null;
};

function GoogleOneTap({ initialSession }: Props) {
  auth.hydrateSession(initialSession);
  const { data, isPending, isRefetching } = auth.useSession();
  const session = isPending && !isRefetching ? initialSession : data;
  useEffect(() => {
    if (!isPending && !session) {
      auth.oneTap().catch((err) => {
        console.error("One Tap auto-prompt failed or skipped:", err);
      });
    }
  }, [session, isPending]);

  return null;
}
export default GoogleOneTap;
