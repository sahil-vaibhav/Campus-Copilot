import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth, type UserRole } from "../../contexts/AuthContext"

interface ProtectedRouteProps {
  requireAdmin?: boolean
  allowedRoles?: UserRole[]
  allowAdminBypass?: boolean
  children?: React.ReactNode
}

export default function ProtectedRoute({
  requireAdmin = false,
  allowedRoles,
  allowAdminBypass = true,
  children
}: ProtectedRouteProps) {
  const { user, loading, role, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-sm text-muted-foreground" role="status">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p>Loading your campus workspace…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Legacy requireAdmin check
  if (requireAdmin && !isAdmin) {
    if (role === "faculty") return <Navigate to="/faculty-portal" replace />
    return <Navigate to="/dashboard" replace />
  }

  // Strict role check
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.includes(role) || (allowAdminBypass && isAdmin)
    if (!hasPermission) {
      if (role === "admin") return <Navigate to="/admin" replace />
      if (role === "faculty") return <Navigate to="/faculty-portal" replace />
      return <Navigate to="/dashboard" replace />
    }
  }

  return children ? <>{children}</> : <Outlet />
}

