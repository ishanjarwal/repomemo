import { env } from "@/env";
import { polar } from "@/lib/polar";
import { ProtectedProcedureContext } from "../types";
import { TRPCError } from "@trpc/server";
import { BILLING_PACK_SLUG, BILLING_PACKS } from "@/server/constants";

class BillingService {
  async createCheckout(
    ctx: ProtectedProcedureContext,
    input: { pack: (typeof BILLING_PACK_SLUG)[number]; return_url: string },
  ) {
    const id = BILLING_PACKS.find((el) => el.slug === input.pack)?.id;
    const other_ids = BILLING_PACKS.filter((el) => el.id !== id).map(
      (el) => el.id,
    );
    if (!id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Something went wrong",
      });
    }

    const success_url = new URL(`${env.NEXT_PUBLIC_ORIGIN}/payment-success`);
    success_url.searchParams.set("checkout_id", "{CHECKOUT_ID}");
    const checkout = await polar.checkouts.create({
      products: [id, ...other_ids],
      // units: input.credits,
      external_customer_id: ctx.user.id,
      return_url: input.return_url,
      success_url: success_url.toString(),
    });

    return checkout.url;
  }

  async getCustomerPortal(ctx: ProtectedProcedureContext) {
    const result = await polar.customerSessions.create({
      external_customer_id: ctx.user.id,
      return_url: `${env.NEXT_PUBLIC_ORIGIN}/dashboard`,
    });

    return result.customer_portal_url;
  }

  async getAvailableCredits(ctx: ProtectedProcedureContext) {
    const r = await ctx.prisma.credits.findUnique({
      where: { userId: ctx.user.id },
    });
    if (!r) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Couldn't find credits for this user.",
      });
    }

    return r.credits;
  }

  async verifyPayment(input: { checkoutId: string }) {
    let checkout;

    try {
      checkout = await polar.checkouts.get(input.checkoutId);
    } catch (error) {
      console.error("Failed to fetch Polar checkout:", error);

      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Unable to verify payment.",
      });
    }

    // Do not consider merely finding the checkout as a successful payment.
    if (checkout.status !== "succeeded") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Payment has not been completed.",
      });
    }

    const creditUnits = BILLING_PACKS.find(
      (pack) => pack.id === checkout.product_id,
    )?.credits;

    if (!creditUnits) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Couldn't get credits right now. Please try again later.",
      });
    }

    return {
      amount: checkout.total_amount,
      currency: checkout.currency,
      creditUnits,
    };
  }
}
export const billingService = new BillingService();
