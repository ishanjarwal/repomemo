import type { inferProcedureBuilderResolverOptions } from "@trpc/server";
import { protectedProcedure } from "./trpc";

export type ProtectedProcedureContext = inferProcedureBuilderResolverOptions<
  typeof protectedProcedure
>["ctx"];
