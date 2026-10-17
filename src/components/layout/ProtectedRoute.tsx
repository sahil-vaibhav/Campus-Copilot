import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export default function ProtectedRoute({ requireAdmin = false }: { requireAdmin?: boolean }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center" role="status">Loading your campus workspace…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
