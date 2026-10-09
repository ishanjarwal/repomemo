import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PaymentSuccessRedirect from "@/features/billing/components/PaymentSuccessRedirect";
import { auth } from "@/lib/auth";
import { polar } from "@/lib/polar";
import { CheckCircle2, Coins, CreditCard } from "lucide-react";
import { api } from "@/lib/trpc/server";

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { checkout_id } = await searchParams;

  if (!checkout_id || Array.isArray(checkout_id)) {
    redirect("/dashboard");
  }

  let payment;

  try {
    payment = await api.billing.verifyPayment({
      checkoutId: checkout_id,
    });
  } catch {
    redirect("/dashboard");
  }

  const amount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: payment.currency,
  }).format(payment.amount / 100);

  return (
    <main className="bg-muted/30 flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        {/* Success header */}
        <CardHeader className="border-b pt-10 pb-8 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="size-9 text-green-600" />
          </div>

          <CardTitle className="text-2xl">Payment successful</CardTitle>

          <CardDescription className="mt-2">
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Amount */}
          <div className="bg-muted/30 rounded-xl border p-5 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              Amount paid
            </p>

            <p className="text-muted-foreground mt-1 text-sm">{amount}</p>
          </div>

          {/* Credits */}
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <Coins className="text-primary size-5" />
              </div>

              <div>
                <p className="font-medium">Credits added</p>
                <p className="text-muted-foreground text-sm">
                  Available in your account
                </p>
              </div>
            </div>

            <span className="text-lg font-bold">+{payment.creditUnits}</span>
          </div>

          <Separator />

          {/* Payment status */}
          <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
            <CreditCard className="size-4" />
            <span>Payment confirmed</span>
          </div>

          {/* Dashboard button */}
          <Button asChild className="h-11 w-full">
            <a href="/dashboard">Continue to dashboard</a>
          </Button>

          <PaymentSuccessRedirect />
        </CardContent>
      </Card>
    </main>
  );
};

export default PaymentSuccessPage;
