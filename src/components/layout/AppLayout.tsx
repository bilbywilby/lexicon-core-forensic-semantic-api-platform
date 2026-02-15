import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
};
export function AppLayout({ children, container = true }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="relative flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur sm:px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
            <ThemeToggle className="static top-auto right-auto" />
          </header>
          <main className={container ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : ""}>
            <div className="py-8 md:py-10 lg:py-12">
              {children}
            </div>
          </main>
          <Toaster richColors closeButton />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}