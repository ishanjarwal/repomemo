"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RiCoinFill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { AddCreditsDialog } from "./AddCreditsDialog";
import { DashboardStats } from "./DashboardStats";
import { QuickActions } from "./QuickActions";
import { RecentProjects } from "./RecentProjects";

interface DashboardViewProps {
  initialUser?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export const DashboardView = ({ initialUser }: DashboardViewProps) => {
  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false);

  const displayName = initialUser?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6 pb-8">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Monitor your indexed codebases, explore semantic search, and manage
            credits.
          </p>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddCreditsOpen(true)}
            className="gap-1.5"
          >
            <RiCoinFill className="text-primary size-3.5" />
            <span>Add Credits</span>
          </Button>

          <Button size="sm" asChild className="gap-1.5">
            <Link href="/new-project">
              <Plus className="size-3.5" />
              <span>New Project</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <DashboardStats onAddCredits={() => setIsAddCreditsOpen(true)} />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 xl:col-span-9">
          <RecentProjects />
        </div>
        <div className="lg:col-span-4 xl:col-span-3">
          <QuickActions onAddCredits={() => setIsAddCreditsOpen(true)} />
        </div>
      </div>

      {/* Add Credits Modal Dialog */}
      <AddCreditsDialog
        open={isAddCreditsOpen}
        onOpenChange={setIsAddCreditsOpen}
      />
    </div>
  );
};
