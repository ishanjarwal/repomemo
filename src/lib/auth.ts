import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { EVENTS, inngest } from "@/server/inngest/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oneTap } from "better-auth/plugins";
import { existingUserSignUpTemplate } from "./email_templates/existing-user";
import { resetPasswordTemplate } from "./email_templates/reset-password";
import { resetPasswordSuccessTemplate } from "./email_templates/reset-password-success";
import { verifyEmailTemplate } from "./email_templates/verify-email";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }, request) => {
      await inngest.send(
        EVENTS.SEND_MAIL.create({
          from: "ishucodes@gmail.com",
          to: user.email,
          subject: "Sign-up attempt with your email",
          html: existingUserSignUpTemplate(`${env.NEXT_PUBLIC_ORIGIN}/login`),
        }),
      );
    },
    sendResetPassword: async (data, request) => {
      await inngest.send(
        EVENTS.SEND_MAIL.create({
          from: "ishucodes@gmail.com",
          to: data.user.email,
          subject: "Reset your password",
          html: resetPasswordTemplate(data.url),
        }),
      );
    },
    onPasswordReset: async ({ user }, request) => {
      await inngest.send(
        EVENTS.SEND_MAIL.create({
          from: "ishucodes@gmail.com",
          to: user.email,
          subject: "Password has been reset",
          html: resetPasswordSuccessTemplate(`${env.NEXT_PUBLIC_ORIGIN}/login`),
        }),
      );
    },
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("Sending verification email now  . . .\n");
      await inngest.send(
        EVENTS.SEND_MAIL.create({
          from: "ishucodes@gmail.com",
          to: user.email,
          subject: "Verify your Email",
          html: verifyEmailTemplate(url),
        }),
      );
    },
  },
  socialProviders: {
    google: {
      clientId: env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.credits.create({
              data: {
                userId: user.id,
              },
            });
          } catch (error) {
            console.log(`Credit record creation failed for user ${user.id}`);
            console.log(error);
          }
        },
      },
    },
  },
  plugins: [
    oneTap({
      clientId: env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
    }),
  ],
});
