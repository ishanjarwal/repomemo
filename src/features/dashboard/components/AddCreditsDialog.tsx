"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Sparkles, Zap } from "lucide-react";
import { RiCoinFill } from "react-icons/ri";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/trpc/react";
import { useTheme } from "next-themes";

const BILLING_PACKS = [
  { slug: "100", title: "100 credits", price: 1, popular: false },
  { slug: "250", title: "250 credits", price: 2.5, popular: false },
  { slug: "500", title: "500 credits", price: 5, popular: false },
  { slug: "1000", title: "1,000 credits", price: 10, popular: true },
  { slug: "5000", title: "5,000 credits", price: 50, popular: false },
  { slug: "10000", title: "10,000 credits", price: 100, popular: false },
] as const;

type BillingPackSlug = (typeof BILLING_PACKS)[number]["slug"];

interface AddCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCreditsDialog = ({
  open,
  onOpenChange,
}: AddCreditsDialogProps) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<BillingPackSlug>("1000");

  const { data: credits, isPending: isCreditPending } =
    api.billing.getAvailableCredits.useQuery();

  const createCheckoutMutation = api.billing.createCheckout.useMutation();

  const selected =
    BILLING_PACKS.find((pack) => pack.slug === selectedPack) ??
    BILLING_PACKS[3];

  const handlePurchase = () => {
    createCheckoutMutation.mutate(
      {
        pack: selected.slug,
        return_url: window.location.href,
      },
      {
        onSuccess(url) {
          const theme = resolvedTheme === "light" ? "light" : "dark";
          const newUrl = new URL(url);
          newUrl.searchParams.set("theme", theme);
          router.push(newUrl.toString());
        },
        onError(error) {
          toast.error(error.message || "Failed to initialize checkout");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl! p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                <RiCoinFill className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  Add Credits
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Power AI embeddings, repository indexing, and code queries
                </DialogDescription>
              </div>
            </div>

            <div className="text-right">
              <span className="text-muted-foreground block text-xs">
                Balance
              </span>
              <span className="text-lg font-bold tabular-nums">
                {isCreditPending ? (
                  <Skeleton className="ml-auto h-5 w-12" />
                ) : (
                  credits?.toLocaleString()
                )}
              </span>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Zap className="text-primary size-3.5" />
              <span>Select a credit pack</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <Sparkles className="text-primary size-3" />
              <span>Instant activation</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {BILLING_PACKS.map((pack) => {
              const isSelected = selectedPack === pack.slug;

              return (
                <button
                  key={pack.slug}
                  type="button"
                  onClick={() => setSelectedPack(pack.slug)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border hover:bg-muted/50 hover:border-foreground/20"
                  }`}
                >
                  {pack.popular && (
                    <span className="bg-primary text-primary-foreground absolute -top-2 right-2 rounded-full px-1.5 py-0.5 text-[9px] font-semibold">
                      Best Value
                    </span>
                  )}

                  <div className="flex items-start justify-between">
                    <span className="text-sm font-semibold">{pack.title}</span>
                    {isSelected && (
                      <div className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
                        <Check className="size-2.5" />
                      </div>
                    )}
                  </div>

                  <span className="text-muted-foreground mt-3 text-xs">
                    ${pack.price.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-muted/50 flex items-center justify-between rounded-xl px-4 py-3">
            <div>
              <p className="text-xs font-medium">Selected Tier</p>
              <p className="text-muted-foreground text-[11px]">
                {selected.title}
              </p>
            </div>
            <p className="text-base font-bold">${selected.price.toFixed(2)}</p>
          </div>
        </div>

        <DialogFooter className="bg-muted/30 border-t p-6 pt-3">
          <div className="w-full space-y-2">
            <Button
              type="button"
              className="w-full font-semibold"
              disabled={createCheckoutMutation.isPending}
              onClick={handlePurchase}
            >
              {createCheckoutMutation.isPending
                ? "Creating checkout..."
                : `Purchase ${selected.title}`}
              {!createCheckoutMutation.isPending && (
                <ArrowUpRight className="ml-1.5 size-4" />
              )}
            </Button>
            <p className="text-muted-foreground text-center text-[11px]">
              Payments are securely processed by Polar. Credits never expire.
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
