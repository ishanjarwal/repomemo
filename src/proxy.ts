import { clerkMiddleware } from "@clerk/nextjs/server";

// Keep clerkMiddleware() and your existing `config.matcher` export;
// they're still required. Only remove the authentication checks.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Clerk frontend API routes.
    "/__clerk/:path*",

    // API routes.
    "/(api|trpc)(.*)",
  ],
};
