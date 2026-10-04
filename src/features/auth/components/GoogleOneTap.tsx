"use client";

import { auth } from "@/lib/auth-client";
import { useEffect, useRef } from "react";

const GoogleOneTap = () => {
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;

    triggered.current = true;

    auth.oneTap().catch((error) => {
      console.error("Google One Tap failed:", error);
    });
  }, []);

  return null;
};

export default GoogleOneTap;
