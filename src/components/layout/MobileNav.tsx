import React from "react"
import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Bell, 
  Menu
} from "lucide-react"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Copilot", href: "/copilot", icon: MessageSquare },
  { name: "Schedule", href: "/timetable", icon: Calendar },
  { name: "Notices", href: "/notices", icon: Bell },
]

interface MobileNavProps {
  onMenuClick: () => void
}

export default function MobileNav({ onMenuClick }: MobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-[env(safe-area-inset-bottom)]">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 text-xs font-medium transition-colors",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </NavLink>
      ))}
      <button 
        onClick={onMenuClick}
        className="flex flex-col items-center justify-center w-full h-full gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="h-5 w-5" />
        <span>Menu</span>
      </button>
    </div>
  )
}
