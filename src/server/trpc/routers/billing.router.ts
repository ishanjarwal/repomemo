import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { billingService } from "../services/billing.service";
import { BILLING_PACK_SLUG } from "@/server/constants";

export const billingRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    .input(z.object({ pack: z.enum(BILLING_PACK_SLUG), return_url: z.url() }))
    .mutation(async ({ ctx, input }) => {
      return await billingService.createCheckout(ctx, input);
    }),

  getCustomerPortal: protectedProcedure.mutation(async ({ ctx }) => {
    return await billingService.getCustomerPortal(ctx);
  }),

  getAvailableCredits: protectedProcedure.query(async ({ ctx }) => {
    return await billingService.getAvailableCredits(ctx);
  }),

  verifyPayment: protectedProcedure
    .input(
      z.object({
        checkoutId: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      return await billingService.verifyPayment(input);
    }),
});
