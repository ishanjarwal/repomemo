"use client";

import Link from "next/link";
import {
  CreditCard,
  ExternalLink,
  HelpCircle,
  Plus,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/trpc/react";

interface QuickActionsProps {
  onAddCredits: () => void;
}

export const QuickActions = ({ onAddCredits }: QuickActionsProps) => {
  const getCustomerPortalMutation = api.billing.getCustomerPortal.useMutation();

  const handleOpenPortal = () => {
    getCustomerPortalMutation.mutate(undefined, {
      onSuccess(url) {
        if (url) {
          window.open(url, "_blank");
        }
      },
      onError(error) {
        toast.error(error.message || "Failed to open billing portal");
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Launch Shortcuts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-xs">
            Frequently used navigation shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="h-9 w-full justify-between text-xs"
            asChild
          >
            <Link href="/new-project">
              <span className="flex items-center gap-2">
                <Plus className="text-primary size-3.5" />
                <span>Connect Repository</span>
              </span>
              <span className="text-muted-foreground text-[10px]">New</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-9 w-full justify-between text-xs"
            onClick={onAddCredits}
          >
            <span className="flex items-center gap-2">
              <CreditCard className="text-primary size-3.5" />
              <span>Purchase Credits</span>
            </span>
            <span className="text-muted-foreground text-[10px]">Top up</span>
          </Button>

          <Button
            variant="outline"
            className="h-9 w-full justify-between text-xs"
            disabled={getCustomerPortalMutation.isPending}
            onClick={handleOpenPortal}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="text-primary size-3.5" />
              <span>Manage Subscription</span>
            </span>
            <span className="text-muted-foreground text-[10px]">Polar</span>
          </Button>

          <Button
            variant="outline"
            className="h-9 w-full justify-between text-xs"
            asChild
          >
            <Link href="/account">
              <span className="flex items-center gap-2">
                <Settings className="text-primary size-3.5" />
                <span>Account Profile</span>
              </span>
              <span className="text-muted-foreground text-[10px]">
                Settings
              </span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-primary size-4" />
            <CardTitle className="text-sm font-semibold">
              How RepoMemo Works
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex gap-2.5">
            <span className="bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
              1
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Connect a public or private GitHub repository using its URL.
            </p>
          </div>
          <div className="flex gap-2.5">
            <span className="bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
              2
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Our background pipeline indexes files and generates 768-dim vector
              embeddings.
            </p>
          </div>
          <div className="flex gap-2.5">
            <span className="bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
              3
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Ask natural language queries and receive contextual answers with
              code citations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
