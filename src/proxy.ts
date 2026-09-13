import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "./env";

// Anyone can access these routes.
const publicRoutes = ["/"];

// These routes require authentication.
const privateRoutes = ["/dashboard"];

// These routes are ONLY for unauthenticated users.
const strictlyPublicRoutes = ["/login", "/sign-up"];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export const proxy = clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Public → allow everyone.
  if (matchesRoute(pathname, publicRoutes)) {
    return;
  }

  // Strictly public → only allow signed-out users.
  if (matchesRoute(pathname, strictlyPublicRoutes)) {
    const { userId } = await auth();

    if (userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return;
  }

  // Private → require authentication.
  if (matchesRoute(pathname, privateRoutes)) {
    await auth.protect(undefined, {
      unauthenticatedUrl: env.NEXT_PUBLIC_ORIGIN + "/login",
    });
    return;
  }

  // Everything else → require authentication.
  await auth.protect(undefined, {
    unauthenticatedUrl: env.NEXT_PUBLIC_ORIGIN + "/login",
  });
});

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
