"use client";

import { useEffect } from "react";
import { auth } from "@/lib/auth-client";

function GoogleOneTap() {
  const { data: session, isPending } = auth.useSession();

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
