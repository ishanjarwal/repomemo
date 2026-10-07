import { env } from "@/env";

export const BILLING_PACKS = [
  {
    slug: "100",
    id: env.POLAR_PRODUCT_ID_100,
  },
  {
    slug: "250",
    id: env.POLAR_PRODUCT_ID_250,
  },
  {
    slug: "500",
    id: env.POLAR_PRODUCT_ID_500,
  },
  {
    slug: "1000",
    id: env.POLAR_PRODUCT_ID_1000,
  },
  {
    slug: "5000",
    id: env.POLAR_PRODUCT_ID_5000,
  },
  {
    slug: "10000",
    id: env.POLAR_PRODUCT_ID_10000,
  },
] as const;

export const BILLING_PACK_SLUG = BILLING_PACKS.map((el) => el.slug);
