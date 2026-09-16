import ThemeToggleButton from "@/components/common/ThemeToggleButton";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await auth.protect();

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="m-2 w-full">
        <div className="bg-sidebar border-sidebar-border flex w-full items-center justify-between rounded-md border px-4 py-2 shadow">
          {/* <SearchBar/> */}
          <SidebarTrigger />
          <div className="ml-auto"></div>
          <div className="flex items-center space-x-2">
            <ThemeToggleButton />
            <UserButton />
          </div>
        </div>

        <div className="bg-sidebar border-sidebar-border mt-4 h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
