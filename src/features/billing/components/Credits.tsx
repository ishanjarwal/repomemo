"use client";

import { ArrowUpRight, Check, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { RiCoinFill } from "react-icons/ri";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { auth } from "@/lib/auth-client";
import { api } from "@/lib/trpc/react";
import { useRouter } from "next/navigation";

const BILLING_PACKS = [
  { slug: "100", title: "100 credits", price: 1 },
  { slug: "250", title: "250 credits", price: 2.5 },
  { slug: "500", title: "500 credits", price: 5 },
  { slug: "1000", title: "1,000 credits", price: 10 },
  { slug: "5000", title: "5,000 credits", price: 50 },
  { slug: "10000", title: "10,000 credits", price: 100 },
] as const;

type BillingPack = (typeof BILLING_PACKS)[number];

type Props = {
  initialSession: typeof auth.$Infer.Session | null;
};

const Credits = ({ initialSession }: Props) => {
  const router = useRouter();
  auth.hydrateSession(initialSession);

  const { resolvedTheme } = useTheme();

  const { data, isPending, isRefetching } = auth.useSession();
  const session = isPending && !isRefetching ? initialSession : data;

  const { data: credits, isPending: isCreditPending } =
    api.billing.getAvailableCredits.useQuery();

  const createCheckoutMutation = api.billing.createCheckout.useMutation();

  const [open, setOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<BillingPack["slug"]>("1000");

  if (!session) return null;

  const selected = BILLING_PACKS.find((pack) => pack.slug === selectedPack)!;

  const handlePurchase = () => {
    createCheckoutMutation.mutate(
      { pack: selected.slug, return_url: window.location.href },
      {
        async onSuccess(url) {
          // await PolarEmbedCheckout.create(url, {
          //   theme: resolvedTheme === "light" ? "light" : "dark",
          // });

          const theme = resolvedTheme === "light" ? "light" : "dark";
          const newUrl = new URL(url);
          newUrl.searchParams.set("theme", theme);
          router.push(newUrl.toString());
        },
        onError(error) {
          toast.error(error.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="group gap-2 rounded-full px-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <RiCoinFill className="text-primary size-3.5" />

          <span className="font-semibold tabular-nums">
            {isCreditPending ? (
              <Skeleton className="h-2 w-6" />
            ) : (
              credits?.toLocaleString()
            )}
          </span>

          <Plus className="text-muted-foreground size-3.5 transition-transform duration-300 group-hover:rotate-90" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="bg-background w-[380px] overflow-hidden rounded-2xl p-0"
      >
        {/* Header */}
        <div className="px-5 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex size-9 items-center justify-center rounded-xl">
                <RiCoinFill className="text-primary size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold">Your credits</p>
                <p className="text-muted-foreground text-xs">
                  Use credits to power AI features
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight tabular-nums">
                {isCreditPending ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  credits?.toLocaleString()
                )}
              </p>
              <p className="text-muted-foreground text-[11px]">available</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Packs */}
        <div className="space-y-4 p-5">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="text-primary size-4" />
              <h3 className="text-sm font-semibold">Add credits</h3>
            </div>

            <p className="text-muted-foreground mt-1 text-xs">
              Choose a credit pack to continue.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {BILLING_PACKS.map((pack) => {
              const isSelected = selectedPack === pack.slug;

              return (
                <button
                  key={pack.slug}
                  type="button"
                  onClick={() => setSelectedPack(pack.slug)}
                  className="border-input hover:bg-accent relative flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors"
                >
                  {isSelected && (
                    <div className="bg-primary text-primary-foreground absolute top-2 right-2 flex size-4 items-center justify-center rounded-full">
                      <Check className="size-2.5" />
                    </div>
                  )}

                  <span className="text-sm font-semibold">{pack.title}</span>

                  <span className="text-muted-foreground text-xs">
                    ${pack.price.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected pack */}
          <div className="bg-muted/50 flex items-center justify-between rounded-xl px-3.5 py-3">
            <div>
              <p className="text-xs font-medium">Selected pack</p>
              <p className="text-muted-foreground text-[11px]">
                {selected.title}
              </p>
            </div>

            <p className="text-sm font-bold">${selected.price.toFixed(2)}</p>
          </div>

          {/* CTA */}
          <Button
            type="button"
            className="group h-11 w-full rounded-xl font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            disabled={createCheckoutMutation.isPending}
            onClick={handlePurchase}
          >
            {createCheckoutMutation.isPending
              ? "Creating checkout..."
              : `Buy ${selected.title}`}

            {!createCheckoutMutation.isPending && (
              <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </Button>

          <p className="text-muted-foreground text-center text-[11px]">
            Credits are added instantly after successful payment.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Credits;
