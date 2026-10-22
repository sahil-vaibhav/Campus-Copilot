import React, { useState } from "react"
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Avatar, AvatarFallback } from "../../components/ui/Avatar"
import { ThemeToggle } from "../../components/ThemeToggle"
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  Bell,
  MessageSquare,
  Sparkles,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  Send,
  Plus,
  Users,
  Shield,
  ExternalLink,
  ChevronRight,
  UserCheck,
  UserX,
} from "lucide-react"

/* ════════════════════════════════════════════════════════════════════════════
   FACULTY NAVIGATION CONFIG
════════════════════════════════════════════════════════════════════════════ */
const facultyNavItems = [
  { name: "Overview", href: "/faculty-portal", icon: LayoutDashboard, end: true },
  { name: "Teaching Schedule", href: "/faculty-portal/classes", icon: Calendar },
  { name: "Attendance Marker", href: "/faculty-portal/attendance", icon: ClipboardCheck },
  { name: "Post Notices", href: "/faculty-portal/notices", icon: Bell },
  { name: "Student Inquiries", href: "/faculty-portal/feedback", icon: MessageSquare },
  { name: "Faculty Copilot", href: "/faculty-portal/copilot", icon: Sparkles },
]

/* ════════════════════════════════════════════════════════════════════════════
   FACULTY SHELL LAYOUT
════════════════════════════════════════════════════════════════════════════ */
export function FacultyShell() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const displayName =
    user?.user_metadata?.full_name ||
    localStorage.getItem("campus-copilot-name") ||
    "Dr. A. Sharma"

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "FC"

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Faculty Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">Campus Copilot</div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Faculty Portal
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Academic Operations
          </div>
          {facultyNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Quick Portal Jump Links */}
          <div className="pt-6 mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Switch Portals
          </div>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-emerald-500" />
            <span>Student Portal View</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-3 rounded-lg px-3.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4 text-purple-500" />
              <span>Admin Portal</span>
            </NavLink>
          )}
        </nav>

        {/* Faculty User Info Bottom */}
        <div className="border-t p-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-semibold">{displayName}</div>
              <div className="truncate text-xs text-muted-foreground">Department of CSE</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive shrink-0"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Faculty Workspace
              </div>
              <h1 className="text-lg font-bold leading-none md:text-xl">
                {location.pathname === "/faculty-portal"
                  ? "Professor Dashboard"
                  : location.pathname.includes("classes")
                  ? "Teaching Schedule & Syllabus"
                  : location.pathname.includes("attendance")
                  ? "Student Attendance Roster"
                  : location.pathname.includes("notices")
                  ? "Publish Course Announcements"
                  : location.pathname.includes("feedback")
                  ? "Student Doubts & Queries"
                  : "Faculty AI Teaching Copilot"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/dashboard" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                Student View
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="hidden sm:inline-flex">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs text-purple-600 dark:text-purple-400">
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   1. FACULTY OVERVIEW DASHBOARD PAGE
════════════════════════════════════════════════════════════════════════════ */
export function FacultyOverviewPage() {
  const { user } = useAuth()
  const facultyName =
    user?.user_metadata?.full_name?.replace(/^(Dr\.|Prof\.)\s*/, "") ||
    "Dr. A. Sharma"

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-blue-600/10 via-primary/10 to-transparent p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Silver Oak University — Faculty Portal
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome, Prof. {facultyName} 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              You have <span className="font-semibold text-foreground">2 scheduled sessions</span> and <span className="font-semibold text-foreground">1 pending attendance roll</span> today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link to="/faculty-portal/attendance" className="gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Mark Today's Attendance
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/faculty-portal/notices" className="gap-2">
                <Bell className="h-4 w-4" />
                Post Notice
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today's Lectures", value: "2 Classes", sub: "Operating Systems (CSE-4)", icon: Clock, color: "text-blue-500" },
          { label: "Enrolled Students", value: "128 Students", sub: "Across 2 course divisions", icon: Users, color: "text-emerald-500" },
          { label: "Pending Doubts", value: "3 Inquiries", sub: "From CSE 4th Semester", icon: MessageSquare, color: "text-amber-500" },
          { label: "Syllabus Progress", value: "68%", sub: "On track for Mid-Term", icon: BookOpen, color: "text-purple-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/70 hover:border-primary/50 transition-all shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Teaching Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Today's Teaching Schedule</CardTitle>
              <CardDescription>Monday lectures and practical sessions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/faculty-portal/classes">Full Timetable</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 font-bold">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Operating Systems (Theory)</div>
                  <div className="text-xs text-muted-foreground">CSE Sem-4 (Div A) · Room 204 · 10:00 AM - 11:00 AM</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Attendance Completed
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link to="/faculty-portal/attendance">View Roster</Link>
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-primary/30 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Operating Systems Lab (Practical)</div>
                  <div className="text-xs text-muted-foreground">CSE Sem-4 (Batch B2) · Lab 3 · 02:00 PM - 04:00 PM</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Upcoming • Roll Call Pending
                  </span>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link to="/faculty-portal/attendance">Mark Attendance</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Faculty AI Copilot Card */}
        <Card className="flex flex-col justify-between border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1">
              <Sparkles className="h-4 w-4" /> Academic Copilot
            </div>
            <CardTitle className="text-lg">Faculty AI Assistant</CardTitle>
            <CardDescription>
              Quickly draft quiz questions, assignment rubrics, and lecture notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "Generate 5 MCQs on CPU Scheduling Algorithms",
              "Draft assignment guidelines for Threads project",
              "Create mid-term exam question blueprint",
            ].map((prompt, i) => (
              <Link
                key={i}
                to={`/faculty-portal/copilot?q=${encodeURIComponent(prompt)}`}
                className="flex items-center justify-between rounded-lg border bg-background p-3 text-xs font-medium hover:bg-muted transition-colors"
              >
                <span className="truncate">{prompt}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </CardContent>
          <div className="p-6 pt-0">
            <Button className="w-full gap-2" asChild>
              <Link to="/faculty-portal/copilot">
                <Sparkles className="h-4 w-4" /> Launch Faculty Copilot
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   2. FACULTY CLASSES & SCHEDULE PAGE
════════════════════════════════════════════════════════════════════════════ */
export function FacultyClassesPage() {
  const classes = [
    {
      code: "CS401",
      name: "Operating Systems",
      type: "Theory",
      semester: "Semester 4 (CSE)",
      students: 64,
      room: "Room 204, Block A",
      schedule: "Tue, Thu (10:00 AM - 11:00 AM)",
      progress: 72,
    },
    {
      code: "CS402L",
      name: "Operating Systems Lab",
      type: "Practical",
      semester: "Semester 4 (CSE - Batch B1, B2)",
      students: 32,
      room: "Lab 3, Innovation Block",
      schedule: "Wed (02:00 PM - 04:00 PM)",
      progress: 65,
    },
    {
      code: "CS603",
      name: "Advanced Distributed Systems",
      type: "Elective",
      semester: "Semester 6 (CSE)",
      students: 48,
      room: "Room 305, Block B",
      schedule: "Mon, Fri (11:00 AM - 12:00 PM)",
      progress: 60,
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Courses &amp; Teaching Schedule</h2>
          <p className="text-sm text-muted-foreground">Semester Academic Year 2026 — Department of Computer Science</p>
        </div>
        <Button asChild>
          <Link to="/faculty-portal/attendance" className="gap-2">
            <ClipboardCheck className="h-4 w-4" /> Take Attendance
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.code} className="flex flex-col justify-between border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary">
                  {cls.code}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground">
                  {cls.type}
                </span>
              </div>
              <CardTitle className="text-lg">{cls.name}</CardTitle>
              <CardDescription>{cls.semester}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>{cls.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <span>{cls.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary shrink-0" />
                  <span>{cls.students} Enrolled Students</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Syllabus Covered</span>
                  <span>{cls.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${cls.progress}%` }} />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/faculty-portal/attendance">Attendance</Link>
                </Button>
                <Button size="sm" className="w-full" asChild>
                  <Link to="/faculty-portal/notices">Post Alert</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   3. FACULTY ATTENDANCE MARKER PAGE (INTERACTIVE)
════════════════════════════════════════════════════════════════════════════ */
export function FacultyAttendancePage() {
  const [selectedSubject, setSelectedSubject] = useState("CS401 - Operating Systems")
  const [sessionDate, setSessionDate] = useState("2026-10-22")
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [students, setStudents] = useState([
    { id: 1, roll: "SO24CS0192", name: "Sahil Vaibhav", status: "present" },
    { id: 2, roll: "SO24CS0193", name: "Jane Doe", status: "present" },
    { id: 3, roll: "SO24CS0194", name: "Rahul Verma", status: "present" },
    { id: 4, roll: "SO24CS0195", name: "Priya Patel", status: "late" },
    { id: 5, roll: "SO24CS0196", name: "Aman Gupta", status: "absent" },
    { id: 6, roll: "SO24CS0197", name: "Ananya Roy", status: "present" },
    { id: 7, roll: "SO24CS0198", name: "Devansh Shah", status: "present" },
    { id: 8, roll: "SO24CS0199", name: "Kavita Rao", status: "present" },
  ])

  const setStudentStatus = (id: number, status: "present" | "absent" | "late") => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    setSavedSuccess(false)
  }

  const markAll = (status: "present" | "absent") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })))
    setSavedSuccess(false)
  }

  const presentCount = students.filter((s) => s.status === "present").length
  const lateCount = students.filter((s) => s.status === "late").length
  const absentCount = students.filter((s) => s.status === "absent").length
  const attendanceRate = Math.round(((presentCount + lateCount) / students.length) * 100)

  const handleSaveAttendance = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 5000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Class Attendance Marker</h2>
          <p className="text-sm text-muted-foreground">Record and submit student lecture presence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => markAll("present")}>
            Mark All Present
          </Button>
          <Button size="sm" onClick={handleSaveAttendance} className="gap-2">
            <ClipboardCheck className="h-4 w-4" /> Save Attendance
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div className="text-sm font-medium">
            Attendance successfully submitted and recorded in Silver Oak student database!
          </div>
        </div>
      )}

      {/* Filter and Metrics Card */}
      <Card>
        <CardContent className="p-4 sm:p-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4 items-center">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Select Course</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>CS401 - Operating Systems</option>
              <option>CS402L - Operating Systems Lab</option>
              <option>CS603 - Advanced Distributed Systems</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Date</label>
            <Input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Attendance Stats</label>
            <div className="mt-1 text-sm font-bold">
              {presentCount} Present · {lateCount} Late · {absentCount} Absent
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Turnout Rate</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-extrabold text-primary">{attendanceRate}%</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${attendanceRate}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Roll Call Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Student Roster Roll Call</CardTitle>
          <CardDescription>Click status badges to toggle attendance for each student</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Roll No</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student Name</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${
                      idx % 2 === 0 ? "" : "bg-muted/10"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{student.roll}</td>
                    <td className="px-4 py-3 font-semibold">{student.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          student.status === "present"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : student.status === "late"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {student.status === "present" && <UserCheck className="h-3 w-3" />}
                        {student.status === "absent" && <UserX className="h-3 w-3" />}
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1.5">
                        <Button
                          size="sm"
                          variant={student.status === "present" ? "default" : "outline"}
                          className="h-7 text-xs px-2.5"
                          onClick={() => setStudentStatus(student.id, "present")}
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={student.status === "late" ? "default" : "outline"}
                          className="h-7 text-xs px-2.5"
                          onClick={() => setStudentStatus(student.id, "late")}
                        >
                          Late
                        </Button>
                        <Button
                          size="sm"
                          variant={student.status === "absent" ? "destructive" : "outline"}
                          className="h-7 text-xs px-2.5"
                          onClick={() => setStudentStatus(student.id, "absent")}
                        >
                          Absent
                        </Button>
                      </div>
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

/* ════════════════════════════════════════════════════════════════════════════
   4. FACULTY NOTICES & ANNOUNCEMENTS PAGE
════════════════════════════════════════════════════════════════════════════ */
export function FacultyNoticesPage() {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [targetBatch, setTargetBatch] = useState("CSE Sem-4 (Operating Systems)")
  const [category, setCategory] = useState("Academic")
  const [isUrgent, setIsUrgent] = useState(false)
  const [content, setContent] = useState("")

  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Operating Systems Assignment 2 Deadline Extended to Friday",
      batch: "CSE Sem-4",
      category: "Academic",
      date: "Today at 09:30 AM",
      urgent: true,
      content: "Due to server maintenance in Lab 3, the submission deadline for CPU Scheduling Simulation is extended to Friday 5:00 PM.",
    },
    {
      id: 2,
      title: "Pre-Midterm Doubt Clearing Tutorial Session",
      batch: "CSE Sem-4 & Sem-6",
      category: "Academic",
      date: "Yesterday",
      urgent: false,
      content: "Special tutorial session on Paging and Virtual Memory will be conducted this Wednesday in Room 204.",
    },
    {
      id: 3,
      title: "Distributed Systems Project Topic Finalization",
      batch: "CSE Sem-6",
      category: "Project",
      date: "Oct 18",
      urgent: false,
      content: "Please submit your capstone partner names and project synopsis before end of week.",
    },
  ])

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    const newNotice = {
      id: Date.now(),
      title,
      batch: targetBatch,
      category,
      date: "Just now",
      urgent: isUrgent,
      content,
    }
    setNotices([newNotice, ...notices])
    setTitle("")
    setContent("")
    setShowForm(false)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Course Announcements &amp; Notices</h2>
          <p className="text-sm text-muted-foreground">Broadcast updates directly to your students' dashboard</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Post New Announcement"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Publish Notice to Students</CardTitle>
            <CardDescription>This announcement will immediately appear on students' Campus Copilot feeds.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold">Announcement Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-term Exam Syllabus Revision"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold">Target Batch / Division</label>
                  <select
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>CSE Sem-4 (Operating Systems)</option>
                    <option>CSE Sem-4 (OS Lab Batch B1/B2)</option>
                    <option>CSE Sem-6 (Distributed Systems)</option>
                    <option>All Enrolled Students</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Academic</option>
                    <option>Assignment</option>
                    <option>Examination</option>
                    <option>Project</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="urgent" className="text-sm font-medium cursor-pointer">
                    Flag as High Priority 📌
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold">Notice Content</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write announcement details..."
                  className="flex w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" /> Broadcast Notice
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((n) => (
          <Card key={n.id} className="border-border hover:border-primary/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {n.urgent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-destructive/15 text-destructive">
                        High Priority
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                      {n.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{n.batch}</span>
                    <span className="text-xs text-muted-foreground">· {n.date}</span>
                  </div>
                  <h3 className="font-bold text-base mt-1">{n.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">{n.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   5. FACULTY STUDENT INQUIRIES & FEEDBACK PAGE
════════════════════════════════════════════════════════════════════════════ */
export function FacultyFeedbackPage() {
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      student: "Sahil Vaibhav",
      roll: "SO24CS0192",
      subject: "Operating Systems",
      question: "Could you please clarify whether Priority Scheduling with Aging is in Scope for Question 3 in Assignment 2?",
      date: "Today at 08:45 AM",
      status: "pending",
      reply: "",
    },
    {
      id: 2,
      student: "Jane Doe",
      roll: "SO24CS0193",
      subject: "OS Lab",
      question: "Will Lab 3 test environment allow using pthread mutex for synchronization task?",
      date: "Yesterday",
      status: "resolved",
      reply: "Yes Jane, GCC with -lpthread is standard across all lab workstations.",
    },
  ])

  const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleSendReply = (id: number) => {
    if (!replyText.trim()) return
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "resolved", reply: replyText } : item
      )
    )
    setReplyText("")
    setActiveReplyId(null)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Student Inquiries &amp; Academic Doubts</h2>
        <p className="text-sm text-muted-foreground">Direct questions submitted by students enrolled in your courses</p>
      </div>

      <div className="space-y-4">
        {inquiries.map((item) => (
          <Card key={item.id} className="border-border">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{item.student}</span>
                  <span className="text-xs text-muted-foreground font-mono">({item.roll})</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">
                    {item.subject}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                    item.status === "resolved"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border">
                "{item.question}"
              </p>

              {item.reply && (
                <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg text-sm">
                  <span className="font-semibold text-primary block text-xs mb-1">Your Response:</span>
                  {item.reply}
                </div>
              )}

              {item.status === "pending" && activeReplyId !== item.id && (
                <Button size="sm" variant="outline" onClick={() => setActiveReplyId(item.id)}>
                  Reply to Student
                </Button>
              )}

              {activeReplyId === item.id && (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your explanation or guidance..."
                    className="flex w-full rounded-md border border-input bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSendReply(item.id)}>
                      Send Reply
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setActiveReplyId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   6. FACULTY AI COPILOT PAGE
════════════════════════════════════════════════════════════════════════════ */
export function FacultyCopilotPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello Professor! I am your Faculty Teaching Copilot. I can assist you with designing multiple-choice quizzes, lecture notes, lab problem statements, and academic rubrics. What would you like to create today?",
    },
  ])
  const [input, setInput] = useState("")

  const quickPrompts = [
    "Generate a 5-question MCQ test on CPU Scheduling with answer keys",
    "Create a grading rubric for student mini-projects (out of 25 marks)",
    "Draft a lecture outline for Virtual Memory and Page Replacement",
    "Write an encouraging notice to students preparing for mid-terms",
  ]

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg = { role: "user", content: text }
    let botReply = ""

    if (text.toLowerCase().includes("quiz") || text.toLowerCase().includes("mcq")) {
      botReply = `Here is a customized 5-question MCQ test for your Operating Systems lecture:

1. **Which scheduling algorithm is non-preemptive?**
   - A) Round Robin
   - B) FCFS (First-Come, First-Served) ✅
   - C) SRTF
   - D) Multilevel Queue with Feedback

2. **Convoy effect is primarily associated with which algorithm?**
   - A) Shortest Job First
   - B) Priority Scheduling
   - C) First-Come, First-Served ✅
   - D) Lottery Scheduling

3. **In Round Robin scheduling, if time quantum is extremely large, it behaves like:**
   - A) FCFS ✅
   - B) SJF
   - C) Priority Scheduling
   - D) LIFO

4. **Which metric measures the elapsed time from process submission to completion?**
   - A) Waiting Time
   - B) Turnaround Time ✅
   - C) Response Time
   - D) Throughput

5. **Starvation can be mitigated using which technique?**
   - A) Aging ✅
   - B) Compaction
   - C) Context Switching
   - D) Paging`
    } else if (text.toLowerCase().includes("rubric")) {
      botReply = `### Evaluation Rubric: Operating Systems Mini-Project (25 Marks)

| Criterion | Poor (0-2) | Good (3-4) | Excellent (5) |
| :--- | :--- | :--- | :--- |
| **System Architecture** | Ill-defined modules | Decoupled architecture | Modular, thread-safe, scalable design |
| **Code Quality & Memory** | Memory leaks present | Clean code with minor leaks | Valgrind verified, 0 leaks, robust error checks |
| **Live Demonstration** | Crashes on test inputs | Handles basic test cases | Handles corner cases & concurrency stress tests |
| **Documentation & Readme** | Missing setup steps | Basic instructions | Clear architecture diagrams, reproduction steps |
| **Viva & Technical Q&A** | Unable to explain code | Explains core logic | Masterful command of underlying kernel concepts |`
    } else {
      botReply = `Certainly, Professor! Based on your course syllabus for Silver Oak University, I've prepared the requested material. You can copy this directly into your lecture slides or class notes, or ask me to modify any specific section!`
    }

    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: botReply }])
    setInput("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto border rounded-2xl bg-card overflow-hidden shadow-sm">
      {/* Copilot Header */}
      <div className="border-b p-4 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Faculty Teaching Assistant</div>
            <div className="text-xs text-muted-foreground">Powered by Campus Copilot AI</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
            <div
              className={`rounded-2xl p-4 text-sm max-w-[85%] leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                  : "bg-muted/50 border rounded-tl-none whitespace-pre-line"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 border-t bg-muted/20 flex gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-xs px-3 py-1.5 rounded-full bg-background border hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot to draft a quiz, syllabus outline, or assignment rubric…"
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
