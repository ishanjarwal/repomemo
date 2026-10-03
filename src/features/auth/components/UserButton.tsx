"use client";

import { LogOut, User2, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { auth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Props = {
  initialSession: typeof auth.$Infer.Session | null;
};

const UserButton = ({ initialSession }: Props) => {
  const router = useRouter();

  auth.hydrateSession(initialSession);
  const { data, isPending, isRefetching } = auth.useSession();
  const session = isPending && !isRefetching ? initialSession : data;

  if (isPending) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  if (!session) {
    return null;
  }

  const { user } = session;

  const name = user.name || "User";
  const email = user.email;
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await auth.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Open account menu"
        >
          <Avatar>
            {user.image && (
              <AvatarImage src={user.image} alt={`${name}'s avatar`} />
            )}

            <AvatarFallback>{initials || <UserRound />}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="bg-background w-72 p-2">
        {/* User information */}
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="size-10">
            {user.image && (
              <AvatarImage src={user.image} alt={`${name}'s avatar`} />
            )}

            <AvatarFallback>{initials || <UserRound />}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="text-muted-foreground truncate text-xs">{email}</p>
          </div>
        </div>

        <div className="bg-border my-1 h-px" />

        {/* Account actions */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            asChild
          >
            <a href="/account">
              <User2 className="size-4" />
              Account
            </a>
          </Button>

          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserButton;
