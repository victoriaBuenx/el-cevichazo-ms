import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/session.service";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AuthProvider } from "@/providers/auth-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthProvider initialUser={user}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="min-w-0 max-w-full overflow-x-hidden">
          <AppTopbar />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 min-w-0 max-w-full overflow-x-hidden">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
