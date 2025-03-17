import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "../../../auth";
import { ThemeToggle } from "@/components/toggle-theme";
import DynamicBreadcrumbs from "@/components/dynamic-breadcrumb";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <header className="flex w-full h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4  justify-between flex-1">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumbs />
            </div>
            <ThemeToggle />
            {/* <div>{session && <NavUser user={session.user} />}</div> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
