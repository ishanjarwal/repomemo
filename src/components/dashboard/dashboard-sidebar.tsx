"use client";

import { env } from "@/env";
import { cn } from "cn";
import {
  CreditCard,
  Folder,
  LayoutDashboard,
  MessageCircleQuestion,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import { Separator } from "../ui/separator";

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
  const { theme } = useTheme();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center justify-between space-x-1 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:space-x-0">
          <div className="flex items-center justify-start space-x-2 group-data-[state=collapsed]:space-x-0">
            <div className="size-8 shrink-0 overflow-hidden rounded-md border-2">
              <Image
                width={128}
                height={128}
                className="object-cover object-center"
                src={theme === "dark" ? "/logo_dark.png" : "/logo_light.png"}
                alt={env.NEXT_PUBLIC_APP_NAME}
              />
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={""}>
                    <Folder />
                    <span>Project 1</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="mt-4">
                <SidebarMenuButton
                  variant={"outline"}
                  asChild
                  className="justify-center border shadow-none hover:shadow-none"
                >
                  <Link href={"/new"} className="hover:bg-sidebar-accent">
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
    </Sidebar>
  );
};

export default DashboardSidebar;
