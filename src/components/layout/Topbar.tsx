import React, { useState, useRef, useEffect, useMemo } from "react"
import {
  Menu,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  CheckCheck,
  Shield,
  ArrowRight,
  Pin,
  GraduationCap
} from "lucide-react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Avatar, AvatarFallback } from "../ui/Avatar"
import { Button } from "../ui/Button"
import { ThemeToggle } from "../ThemeToggle"
import { useAuth } from "../../contexts/AuthContext"
import { noticesMock, currentUser } from "../../data/mock"

interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, isFaculty, logout } = useAuth()

  // State for notifications
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [readNotifIds, setReadNotifIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("campus-copilot-read-notices")
      return saved ? JSON.parse(saved) : [4, 5, 6, 7, 9]
    } catch {
      return [4, 5, 6, 7, 9]
    }
  })

  // State for profile menu
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Refs for click outside
  const notifContainerRef = useRef<HTMLDivElement>(null)
  const profileContainerRef = useRef<HTMLDivElement>(null)

  const displayName =
    user?.user_metadata?.full_name ||
    localStorage.getItem("campus-copilot-name") ||
    currentUser.name

  const displayRole = user?.user_metadata?.role || currentUser.role
  const displayEmail = user?.email || currentUser.email

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U"

  // Unread notifications calculation
  const unreadNotifs = useMemo(() => {
    return noticesMock.filter((n) => !readNotifIds.includes(n.id))
  }, [readNotifIds])

  const markAllAsRead = () => {
    const allIds = noticesMock.map((n) => n.id)
    setReadNotifIds(allIds)
    localStorage.setItem("campus-copilot-read-notices", JSON.stringify(allIds))
  }

  const markOneAsRead = (id: number) => {
    if (!readNotifIds.includes(id)) {
      const updated = [...readNotifIds, id]
      setReadNotifIds(updated)
      localStorage.setItem("campus-copilot-read-notices", JSON.stringify(updated))
    }
  }

  // Handle global Escape key to close open menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotifOpen(false)
        setIsProfileOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false)
      }
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsProfileOpen(false)
    await logout()
    navigate("/login")
  }

  // Create page title based on pathname
  const getPageTitle = () => {
    const path = location.pathname.split("/")[1]
    if (!path) return "Dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {/* Left side: Mobile menu toggle + page title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <h1 className="text-xl font-semibold hidden md:block">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: ThemeToggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        {/* Notifications Icon & Popover */}
        <div ref={notifContainerRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen)
              setIsProfileOpen(false)
            }}
            className="relative text-muted-foreground hover:text-foreground"
            aria-label="Campus notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadNotifs.length}
              </span>
            )}
          </Button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                  {unreadNotifs.length > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/15 text-primary font-medium">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                {noticesMock.slice(0, 6).map((notice) => {
                  const isRead = readNotifIds.includes(notice.id)
                  return (
                    <div
                      key={notice.id}
                      onClick={() => {
                        markOneAsRead(notice.id)
                        setIsNotifOpen(false)
                        navigate(`/notices/${notice.id}`)
                      }}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                        isRead ? "hover:bg-muted/40 opacity-75" : "bg-primary/5 hover:bg-primary/10"
                      }`}
                    >
                      <div
                        className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                          notice.isImportant
                            ? "bg-destructive/15 text-destructive"
                            : "bg-primary/15 text-primary"
                        }`}
                      >
                        {notice.isImportant ? <Pin className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {notice.type}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{notice.date}</span>
                        </div>
                        <p className={`text-sm leading-snug line-clamp-2 ${!isRead ? "font-semibold text-foreground" : "font-normal text-muted-foreground"}`}>
                          {notice.title}
                        </p>
                      </div>

                      {!isRead && (
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t bg-muted/20 text-center">
                <Link
                  to="/notices"
                  onClick={() => setIsNotifOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  View all announcements <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown Menu */}
        <div ref={profileContainerRef} className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen)
              setIsNotifOpen(false)
            }}
            className="flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-transform active:scale-95"
            aria-label="User profile menu"
          >
            <Avatar className="h-9 w-9 cursor-pointer ring-1 ring-border hover:ring-primary transition-all">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95">
              {/* User Info Header */}
              <div className="flex items-center gap-3 p-3 border-b border-border/60">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm text-foreground truncate">
                    {displayName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {displayEmail}
                  </span>
                  <span className="mt-1 inline-flex w-fit px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary capitalize">
                    {displayRole}
                  </span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </Link>

                {(isFaculty || isAdmin) && (
                  <Link
                    to="/faculty-portal"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                    <span>Faculty Portal</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>

              <div className="border-t border-border/60 my-1" />

              {/* Log out Action */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
