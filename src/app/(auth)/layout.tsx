import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      <div className="bg-foreground text-background relative hidden w-[45%] overflow-hidden lg:flex">
        <div className="absolute inset-0">
          <div className="border-background/10 absolute -top-24 -left-24 size-80 rounded-full border" />
          <div className="border-background/10 absolute -right-24 -bottom-32 size-[28rem] rounded-full border" />
          <div className="border-background/5 absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight">
              RepoMemo<span className="text-muted-foreground">.</span>
            </Link>
          </div>

          <div className="max-w-md">
            <p className="text-background/50 mb-6 text-sm font-medium tracking-[0.25em] uppercase">
              Understand your codebase
            </p>

            <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight xl:text-5xl">
              Your repository,
              <br />
              finally searchable.
            </h1>

            <p className="text-background/60 mt-6 max-w-sm text-sm leading-6">
              Ask questions about your code, understand changes, and navigate
              your repository with AI.
            </p>
          </div>

          <p className="text-background/40 text-xs">
            Built for developers who want to spend less time searching.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
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
