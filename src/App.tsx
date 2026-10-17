import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppShell from "./components/layout/AppShell"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
const LandingPage = lazy(() => import("./pages/LandingPage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"))
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
const AdminShell = lazy(() => import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminShell })))
const AdminOverviewPage = lazy(() => import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminOverviewPage })))
const AdminUsersPage = lazy(() => import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminUsersPage })))
const AdminNoticesPage = lazy(() => import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminNoticesPage })))
const AdminFeedbackPage = lazy(() => import("./pages/admin/AdminDashboardPage").then((module) => ({ default: module.AdminFeedbackPage })))
import PwaInstallPrompt from "./components/PwaInstallPrompt"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-muted-foreground" role="status">Loading campus workspace…</div>}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Student / Faculty — protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
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

          {/* Admin — protected + admin role */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route element={<AdminShell />}>
              <Route path="/admin" element={<AdminOverviewPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/notices" element={<AdminNoticesPage />} />
              <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        <PwaInstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
