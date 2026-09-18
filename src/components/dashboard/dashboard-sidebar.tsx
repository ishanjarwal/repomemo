"use client";

import { env } from "@/env";
import { cn } from "cn";
import {
  CreditCard,
  Folder,
  LayoutDashboard,
  LogOut,
  MessageCircleQuestion,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { SignOutButton } from "@clerk/nextjs";
import ProjectListSidebar from "@/features/project/components/project-list-sidebar";

const APPLICATION_MENU = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "QnA",
    href: "/qna",
    icon: MessageCircleQuestion,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center justify-between space-x-1 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:space-x-0">
          <div className="flex items-center justify-start space-x-2 group-data-[state=collapsed]:space-x-0">
            <div className="size-8 shrink-0 overflow-hidden rounded-md border-2">
              <div>
                <Image
                  src="/logo_light.png"
                  alt="RepoMemo"
                  width={128}
                  height={128}
                  className="block object-cover object-center dark:hidden"
                />

                <Image
                  src="/logo_dark.png"
                  alt="RepoMemo"
                  width={128}
                  height={128}
                  className="hidden object-cover object-center dark:block"
                />
              </div>
            </div>
            <div className="flex flex-col group-data-[state=collapsed]:hidden">
              <h1 className="truncate font-semibold">
                {env.NEXT_PUBLIC_APP_NAME}
              </h1>
              <span className="text-muted-foreground truncate text-xs">
                {env.NEXT_PUBLIC_APP_VERSION}
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Applicaton</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {APPLICATION_MENU.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      className={cn(
                        pathname === item.href &&
                          "bg-primary! hover:bg-primary! text-primary-foreground! hover:text-primary-foreground!",
                      )}
                      href={item.href}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <ProjectListSidebar />

              <SidebarMenuItem className="mt-4">
                <SidebarMenuButton
                  variant={"default"}
                  asChild
                  className="justify-center border"
                >
                  <Link href={"/new-project"}>
                    <Plus />
                    <span className="group-data-[state=collapsed]:hidden">
                      New Project
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup></SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SignOutButton>
          <Button variant={"destructive"}>
            <LogOut />
            Log out
          </Button>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
