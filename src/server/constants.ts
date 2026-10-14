import { env } from "@/env";

export const BILLING_PACKS = [
  {
    slug: "100",
    id: env.POLAR_PRODUCT_ID_100,
    credits: 100,
  },
  {
    slug: "250",
    id: env.POLAR_PRODUCT_ID_250,
    credits: 250,
  },
  {
    slug: "500",
    id: env.POLAR_PRODUCT_ID_500,
    credits: 500,
  },
  {
    slug: "1000",
    id: env.POLAR_PRODUCT_ID_1000,
    credits: 1000,
  },
  {
    slug: "5000",
    id: env.POLAR_PRODUCT_ID_5000,
    credits: 5000,
  },
  {
    slug: "10000",
    id: env.POLAR_PRODUCT_ID_10000,
    credits: 10000,
  },
] as const;

export const BILLING_PACK_SLUG = BILLING_PACKS.map((el) => el.slug);

export const PROJECT_SIZE = {
  small: {
    maxFiles: 100,
    credits: 20,
  },
  medium: {
    maxFiles: 1_000,
    credits: 50,
  },
} as const;
export type ProjectSize = "small" | "medium" | "large";
