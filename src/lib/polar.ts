import { env } from "@/env";
import { createPolar } from "@polar-sh/sdk/2026-10";

export const polar = createPolar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  environment: env.POLAR_ENVIRONMENT,
  organizationId: env.POLAR_ORGANIZATION_ID,
});
