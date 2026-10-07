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
    const checkout = await polar.checkouts.create({
      products: [id, ...other_ids],
      // units: input.credits,
      external_customer_id: ctx.user.id,
      return_url: input.return_url,
      success_url: input.return_url,
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
    console.log(meter);
    if (!meter) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Something went wrong",
      });
    }

    return meter.balance;
  }
}
export const billingService = new BillingService();
