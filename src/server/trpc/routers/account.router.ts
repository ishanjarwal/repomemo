import { setPasswordSchema } from "@/features/account/schema";
import { auth } from "@/lib/auth";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { passwordSchema } from "@/features/auth/schema";

export const accountRouter = createTRPCRouter({
  setPassword: protectedProcedure
    .input(z.object({ newPassword: passwordSchema }))
    .mutation(async ({ ctx, input }) => {
      await auth.api.setPassword({
        body: { newPassword: input.newPassword },
        headers: ctx.headers,
      });
      return;
    }),
});
