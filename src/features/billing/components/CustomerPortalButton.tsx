"use client";

import { Button } from "@/components/ui/button";
import { polar } from "@/lib/polar";
import { api } from "@/lib/trpc/react";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const CustomerPortalButton = () => {
  const router = useRouter();
  const m = api.billing.getCustomerPortal.useMutation();

  return (
    <Button
      onClick={() => {
        m.mutate(undefined, {
          onSuccess: (url) => {
            router.push(url);
          },
        });
      }}
      disabled={m.isPending}
      variant={"ghost"}
      className="h-9 w-full justify-start"
    >
      {m.isPending ? (
        <>
          <Loader2 className="animate-spin" />
          <span>Loading</span>
        </>
      ) : (
        <>
          <CreditCard />
          <span>Billing</span>
        </>
      )}
    </Button>
  );
};

export default CustomerPortalButton;
