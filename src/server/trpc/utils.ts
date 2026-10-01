import { TRPCError } from "@trpc/server";
import { Prisma } from "../../../generated/prisma/client";

/**
 * Global error boundary for the application. This function sanitizes the incoming error and sends and appropriate error message to the frontend
 * @param error
 * @returns TRPCError
 */

export function sanitizeError(error: unknown): TRPCError {
  // Pass through existing tRPC errors directly
  if (error instanceof TRPCError) {
    return error;
  }

  // 1. Prisma Errors
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError
  ) {
    console.error("[Prisma Error]:", error);
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again later.",
      cause: error,
    });
  }

  // 2. Fallback for unexpected errors
  console.error("[Unhandled Error]:", error);
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred. Please try again later.",
    cause: error,
  });
}
