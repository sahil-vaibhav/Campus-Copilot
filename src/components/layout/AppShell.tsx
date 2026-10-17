import React, { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import MobileNav from "./MobileNav"
import { cn } from "@/lib/utils"

export default function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isCopilot = location.pathname.startsWith("/copilot")

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Sidebar - desktop and tablet */}
      <div className="hidden md:block">
        <Sidebar
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden w-full relative">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* Page content */}
        <main
          className={cn(
            "flex-1 w-full",
            isCopilot
              ? "flex flex-col h-full overflow-hidden p-0 pb-16 md:pb-0"
              : "overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8"
          )}
        >
          <Outlet />
        </main>

        <MobileNav onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      </div>

      {/* Mobile Drawer Slide-out (when Menu is clicked in MobileNav) */}
      <div className="md:hidden">
        <Sidebar
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />
      </div>
    </div>
  )
}
