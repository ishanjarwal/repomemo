import ThemeToggleButton from "@/components/common/ThemeToggleButton";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/login");
  }

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
            {/* <UserButton /> */}
          </div>
        </div>

        <div className="bg-sidebar border-sidebar-border mt-4 h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
