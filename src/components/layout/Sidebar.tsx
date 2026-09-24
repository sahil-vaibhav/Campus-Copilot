import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Bell, 
  Library, 
  Users, 
  Building2, 
  MessageCircleQuestion,
  Settings,
  X,
  GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campus Copilot", href: "/copilot", icon: MessageSquare },
  { name: "Timetable", href: "/timetable", icon: Calendar },
  { name: "Notices", href: "/notices", icon: Bell },
  { name: "Library", href: "/library", icon: Library },
  { name: "Faculty", href: "/faculty", icon: Users },
  { name: "Campus Services", href: "/services", icon: Building2 },
  { name: "Feedback", href: "/feedback", icon: MessageCircleQuestion },
]

const secondaryNavItems = [
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <GraduationCap className="h-6 w-6" />
            <span>Campus Copilot</span>
          </NavLink>
          <button 
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              )
            })}
          </div>

          <div className="mt-8">
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Preferences
            </div>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href)
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                )
              })}
            </div>
          </div>
        </nav>

        <div className="border-t p-4">
          <NavLink to="/profile" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
              <Avatar>
                <AvatarFallback>SV</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Sahil Vaibhav</span>
                <span className="text-xs text-muted-foreground">CSE, Sem 4</span>
              </div>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  )
}
