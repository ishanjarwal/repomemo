import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    GITHUB_TOKEN: z.string(),

    GEMINI_API_KEY: z.string(),

    GOOGLE_AUTH_CLIENT_SECRET: z.string(),

    GITHUB_CLIENT_SECRET: z.string(),

    RESEND_MAIL_SECRET: z.string(),

    POLAR_ACCESS_TOKEN: z.string(),
    POLAR_ORGANIZATION_ID: z.string(),
    POLAR_ENVIRONMENT: z.enum(["production", "sandbox"]),
    POLAR_WEBHOOK_SECRET: z.string(),

    POLAR_PRODUCT_ID_100: z.string(),
    POLAR_PRODUCT_ID_250: z.string(),
    POLAR_PRODUCT_ID_500: z.string(),
    POLAR_PRODUCT_ID_1000: z.string(),
    POLAR_PRODUCT_ID_5000: z.string(),
    POLAR_PRODUCT_ID_10000: z.string(),

    POLAR_FEATURE_USAGE_METER_ID: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_ORIGIN: z.url(),

    NEXT_PUBLIC_APP_NAME: z.string(),
    NEXT_PUBLIC_APP_VERSION: z.string(),

    NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID: z.string(),
    NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,

    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,

    NEXT_PUBLIC_ORIGIN: process.env.NEXT_PUBLIC_ORIGIN,

    GITHUB_TOKEN: process.env.GITHUB_TOKEN,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY,

    NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,

    NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    RESEND_MAIL_SECRET: process.env.RESEND_MAIL_SECRET,

    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_ORGANIZATION_ID: process.env.POLAR_ORGANIZATION_ID,
    POLAR_ENVIRONMENT: process.env.POLAR_ENVIRONMENT,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,

    POLAR_PRODUCT_ID_100: process.env.POLAR_PRODUCT_ID_100,
    POLAR_PRODUCT_ID_250: process.env.POLAR_PRODUCT_ID_250,
    POLAR_PRODUCT_ID_500: process.env.POLAR_PRODUCT_ID_500,
    POLAR_PRODUCT_ID_1000: process.env.POLAR_PRODUCT_ID_1000,
    POLAR_PRODUCT_ID_5000: process.env.POLAR_PRODUCT_ID_5000,
    POLAR_PRODUCT_ID_10000: process.env.POLAR_PRODUCT_ID_10000,

    POLAR_FEATURE_USAGE_METER_ID: process.env.POLAR_FEATURE_USAGE_METER_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
