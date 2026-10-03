import { env } from "@/env";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "cn";
import ThemeToggleButton from "@/components/common/ThemeToggleButton";

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <main className="bg-muted/30 relative flex min-h-screen overflow-hidden">
      {/* Decorative side panel */}
      <div className="bg-background relative hidden w-[45%] overflow-hidden lg:flex">
        <AnimatedGridPattern
          className={cn(
            "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
          maxOpacity={0.2}
        />
        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-xl font-semibold tracking-tight">
                {env.NEXT_PUBLIC_APP_NAME}.
              </Link>
            </div>
            <div>
              <ThemeToggleButton />
            </div>
          </div>

          <div className="max-w-md">
            <p className="text-muted-foreground mb-6 text-sm font-medium tracking-[0.25em] uppercase">
              Understand your codebase
            </p>

            <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight xl:text-5xl">
              Your repository,
              <br />
              finally searchable.
            </h1>

            <p className="text-muted-foreground mt-6 max-w-sm text-sm leading-6">
              Ask questions about your code, understand changes, and navigate
              your repository with AI.
            </p>
          </div>

          <p className="text-muted-foreground text-xs">
            Built for developers who want to spend less time searching.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 px-3 lg:hidden">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              RepoMemo<span className="text-muted-foreground">.</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
