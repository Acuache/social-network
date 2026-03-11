import { Outlet } from "react-router"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export const SocialLayout = () => {
  return (
    <div className="relative max-w-5xl mx-auto h-svh **:data-[slot=sidebar-container]:absolute ">
      <SidebarProvider className="h-full" style={{ "--sidebar-width": "fit-content" } as React.CSSProperties}>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <header className="flex items-center p-2 pt-0">
          </header>
          <main className="flex flex-col overflow-hidden dark-mode px-7 sm:px-17">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
