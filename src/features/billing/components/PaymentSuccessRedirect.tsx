"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PaymentSuccessRedirect = () => {
  const [secs, setSecs] = useState(3);
  const router = useRouter();

  // Countdown
  useEffect(() => {
    if (secs === 0) return;

    const timeout = setTimeout(() => {
      setSecs((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [secs]);

  // Redirect is a side effect, so keep it separate from the state updater.
  useEffect(() => {
    if (secs === 0) {
      router.replace("/dashboard");
    }
  }, [secs, router]);

  return (
    <p className="text-muted-foreground text-center text-sm">
      Redirecting to dashboard in {secs}
    </p>
  );
};

export default PaymentSuccessRedirect;
