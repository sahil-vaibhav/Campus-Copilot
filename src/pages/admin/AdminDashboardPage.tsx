import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, Link, Outlet, NavLink } from "react-router-dom"
import { 
  Users, Bell, FileText, Plus, Activity, ShieldCheck, Home, ChevronRight, LogOut
} from "lucide-react"

const adminNavItems = [
  { name: "Overview", href: "/admin", icon: Home, end: true },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Feedback", href: "/admin/feedback", icon: FileText },
]

import { ThemeToggle } from "../../components/ThemeToggle"
import { Menu, X, ExternalLink, GraduationCap } from "lucide-react"

export function AdminShell() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin Topbar */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Campus Copilot</div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Admin Control Center</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex text-xs gap-1.5">
            <Link to="/faculty-portal">
              <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
              Faculty Portal
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="text-xs gap-1.5">
            <Link to="/dashboard">
              <ExternalLink className="h-3.5 w-3.5 text-emerald-500" />
              Student Portal
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Admin Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-50 flex w-60 border-r bg-card flex-col py-4 px-3 gap-1.5 transition-transform duration-300 md:static md:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Administration
          </div>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Other Portals
          </div>
          <NavLink
            to="/faculty-portal"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <GraduationCap className="h-4 w-4 text-blue-500" />
            <span>Faculty Workspace</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-emerald-500" />
            <span>Student Dashboard</span>
          </NavLink>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/* ─── Overview ─── */
export function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground text-sm">Silver Oak University — Campus Copilot</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: "1,248", sub: "+12 this month", icon: Users },
          { label: "Active Notices", value: "24", sub: "3 marked urgent", icon: Bell },
          { label: "Feedback Reports", value: "12", sub: "5 pending review", icon: FileText },
          { label: "System Status", value: "Healthy", sub: "All services up", icon: Activity, valueClass: "text-green-600 dark:text-green-400" },
        ].map(({ label, value, sub, icon: Icon, valueClass }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${valueClass || ""}`}>{value}</div>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {adminNavItems.slice(1).map((item) => (
          <Link key={item.name} to={item.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Manage {item.name}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* DB Integration info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backend Integration</CardTitle>
          <CardDescription>Supabase + Drizzle ORM status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Supabase Auth", status: "Connected" },
            { label: "Drizzle Schema", status: "Generated" },
            { label: "Postgres Tables", status: "Pending migration" },
          ].map(({ label, status }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === "Connected" || status === "Generated" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                {status}
              </span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            Run <code className="bg-muted px-1 rounded">npx drizzle-kit push</code> to sync schema to Supabase.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Users ─── */
const mockUsers = [
  { id: 1, name: "Sahil Vaibhav", email: "sahil.v@silveroak.edu", role: "student", status: "Active", joined: "Sep 2024" },
  { id: 2, name: "Dr. A. Sharma", email: "asharma@silveroak.edu", role: "faculty", status: "Active", joined: "Aug 2022" },
  { id: 3, name: "Jane Doe", email: "jane.d@silveroak.edu", role: "student", status: "Active", joined: "Sep 2024" },
  { id: 4, name: "Admin User", email: "admin@silveroak.edu", role: "admin", status: "Active", joined: "Jan 2023" },
]

export function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const filtered = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <Input
            placeholder="Search users by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr key={user.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        user.role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : user.role === "faculty" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-muted text-muted-foreground"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{user.joined}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Notices ─── */
const mockNotices = [
  { id: 1, title: "Mid-Semester Examination Schedule", type: "Examination", date: "Today", important: true },
  { id: 2, title: "Campus Placement Drive: TechCorp", type: "Placement", date: "Yesterday", important: true },
  { id: 3, title: "Annual Tech Fest Registrations Open", type: "Events", date: "Oct 15", important: false },
  { id: 4, title: "Library Book Return Deadline", type: "Academic", date: "Oct 12", important: false },
]

export function AdminNoticesPage() {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState("Academic")
  const [important, setImportant] = useState(false)
  const [content, setContent] = useState("")
  const [notices, setNotices] = useState(mockNotices)

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    const newNotice = { id: Date.now(), title, type, date: "Just now", important }
    setNotices([newNotice, ...notices])
    setTitle(""); setContent(""); setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Notices</h1>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "New Notice"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Publish New Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublish} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title…" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {["Academic", "Examination", "Events", "Placement", "General", "Emergency"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} className="rounded" />
                    Mark as Important
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Notice details…" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
              </div>
              <Button type="submit" className="gap-2">
                <Bell className="h-4 w-4" />
                Publish Notice
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {notices.map((notice) => (
              <div key={notice.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {notice.important && <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />}
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{notice.title}</div>
                    <div className="text-xs text-muted-foreground">{notice.type} · {notice.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {notice.important && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium hidden sm:block">Important</span>}
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Feedback ─── */
const mockFeedback = [
  { id: 1, student: "Sahil Vaibhav", category: "IT Support", description: "Wi-Fi not working in library block B", priority: "High", status: "In Progress", date: "Oct 12" },
  { id: 2, student: "Jane Doe", category: "Canteen", description: "More vegetarian meal options needed", priority: "Medium", status: "Submitted", date: "Oct 10" },
  { id: 3, student: "John Smith", category: "Infrastructure", description: "Classroom projector in 302 broken", priority: "Low", status: "Resolved", date: "Oct 8" },
]

const statusColors: Record<string, string> = {
  "Submitted": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Resolved": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
}

export function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState(mockFeedback)

  const updateStatus = (id: number, status: string) => {
    setFeedback((prev) => prev.map((f) => f.id === id ? { ...f, status } : f))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Feedback &amp; Complaints</h1>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {feedback.map((item) => (
              <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{item.category}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.priority}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>{item.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="text-xs text-muted-foreground">By {item.student} · {item.date}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {item.status !== "In Progress" && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus(item.id, "In Progress")}>
                        Mark In Progress
                      </Button>
                    )}
                    {item.status !== "Resolved" && (
                      <Button variant="default" size="sm" onClick={() => updateStatus(item.id, "Resolved")}>
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
