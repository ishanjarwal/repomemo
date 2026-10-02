import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { cn } from "@/lib/utils";
import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Fira_Code, Inter, Plus_Jakarta_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "RepoMemo",
  description: "AI RAG Application for Github Repos",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-paragraph",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-code",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // next-themes modifies <html> on the client
      className={cn(
        plusJakartaSans.variable,
        inter.variable,
        firaCode.variable,
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          <TooltipProvider>
            <TRPCReactProvider>
              <Toaster richColors={true} position="top-center" />
              {children}
            </TRPCReactProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
