import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppShell from "./components/layout/AppShell"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

const LandingPage = lazy(() => import("./pages/LandingPage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"))

// Student Portal Pages
const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const CopilotPage = lazy(() => import("./pages/CopilotPage"))
const TimetablePage = lazy(() => import("./pages/TimetablePage"))
const NoticesPage = lazy(() => import("./pages/NoticesPage"))
const NoticeDetailPage = lazy(() => import("./pages/NoticeDetailPage"))
const LibraryPage = lazy(() => import("./pages/LibraryPage"))
const FacultyPage = lazy(() => import("./pages/FacultyPage"))
const ServicesPage = lazy(() => import("./pages/ServicesPage"))
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"))
const ProfilePage = lazy(() => import("./pages/ProfilePage"))
const SettingsPage = lazy(() => import("./pages/SettingsPage"))

// Faculty Portal Pages
const FacultyShell = lazy(() =>
  import("./pages/faculty/FacultyPortalPage").then((m) => ({ default: m.FacultyShell }))
)
const FacultyOverviewPage = lazy(() =>
  import("./pages/faculty/FacultyPortalPage").then((m) => ({ default: m.FacultyOverviewPage }))
)
const FacultyClassesPage = lazy(() =>
  import("./pages/faculty/FacultyPortalPage").then((m) => ({ default: m.FacultyClassesPage }))
)
const FacultyAttendancePage = lazy(() =>
  import("./pages/faculty/FacultyPortalPage").then((m) => ({ default: m.FacultyAttendancePage }))
)
const FacultyNoticesPage = lazy(() =>
  import("./pages/faculty/FacultyPortalPage").then((m) => ({ default: m.FacultyNoticesPage }))
)
const FacultyFeedbackPage = lazy(() =>
  import("./pages/faculty/FacultyPortalPage").then((m) => ({ default: m.FacultyFeedbackPage }))
)
const FacultyCopilotPage = lazy(() =>
  import("./pages/faculty/FacultyPortalPage").then((m) => ({ default: m.FacultyCopilotPage }))
)

// Admin Portal Pages
const AdminShell = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminShell }))
)
const AdminOverviewPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminOverviewPage }))
)
const AdminUsersPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminUsersPage }))
)
const AdminNoticesPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminNoticesPage }))
)
const AdminFeedbackPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminFeedbackPage }))
)

import PwaInstallPrompt from "./components/PwaInstallPrompt"

// Smart role-based router
function PortalRedirect() {
  const { role } = useAuth()
  if (role === "admin") return <Navigate to="/admin" replace />
  if (role === "faculty") return <Navigate to="/faculty-portal" replace />
  return <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="grid min-h-screen place-items-center text-sm text-muted-foreground bg-background" role="status">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p>Loading campus workspace…</p>
              </div>
            </div>
          }
        >
          <Routes>
            {/* 1. Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Smart Portal Redirect */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <PortalRedirect />
                </ProtectedRoute>
              }
            />

            {/* 2. Student Portal Routes (Accessible by Students, Faculty & Admin) */}
            <Route element={<ProtectedRoute allowedRoles={["student", "faculty", "admin"]} />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/student" element={<Navigate to="/dashboard" replace />} />
                <Route path="/copilot" element={<CopilotPage />} />
                <Route path="/timetable" element={<TimetablePage />} />
                <Route path="/notices" element={<NoticesPage />} />
                <Route path="/notices/:id" element={<NoticeDetailPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/faculty" element={<FacultyPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* 3. Faculty Portal Routes (Protected for Faculty and Admin) */}
            <Route element={<ProtectedRoute allowedRoles={["faculty", "admin"]} />}>
              <Route element={<FacultyShell />}>
                <Route path="/faculty-portal" element={<FacultyOverviewPage />} />
                <Route path="/faculty-portal/classes" element={<FacultyClassesPage />} />
                <Route path="/faculty-portal/attendance" element={<FacultyAttendancePage />} />
                <Route path="/faculty-portal/notices" element={<FacultyNoticesPage />} />
                <Route path="/faculty-portal/feedback" element={<FacultyFeedbackPage />} />
                <Route path="/faculty-portal/copilot" element={<FacultyCopilotPage />} />
              </Route>
            </Route>

            {/* 4. Admin Portal Routes (Protected for Admin) */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route element={<AdminShell />}>
                <Route path="/admin" element={<AdminOverviewPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/notices" element={<AdminNoticesPage />} />
                <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <PwaInstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
