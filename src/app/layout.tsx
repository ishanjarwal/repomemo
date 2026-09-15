import "@/styles/globals.css";

import { type Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/lib/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "RepoMemo",
  description: "AI RAG Application for Github Repos",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(plusJakartaSans.variable, inter.variable)}>
      <body>
        <ClerkProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
