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
    });

    return result.customer_portal_url;
  }

  async getAvailableCredits(ctx: ProtectedProcedureContext) {
    const state = await polar.customers.getStateExternal(ctx.user.id);
    const meter = state.active_meters.find(
      (meter) => meter.meter_id === env.POLAR_FEATURE_USAGE_METER_ID,
    );
    if (!meter) {
      return 0;
    }

    return meter.balance;
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

    // Only expose the information that the success page actually needs.
    const benefit = checkout.product?.benefits[0];

    const creditUnits =
      benefit?.type === "meter_credit" ? benefit.properties.units : 0;

    return {
      amount: checkout.total_amount,
      currency: checkout.currency,
      creditUnits,
    };
  }
}
export const billingService = new BillingService();
