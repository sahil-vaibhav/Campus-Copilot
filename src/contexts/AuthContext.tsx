import React, { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { isSupabaseConfigured, supabase } from "../lib/supabase"

export type UserRole = "student" | "faculty" | "admin"

function resolveUserRole(user: User | null, sessionEmail?: string | null): UserRole {
  const email = (user?.email || sessionEmail || "").toLowerCase().trim()
  const appRole = (user?.app_metadata?.role as string | undefined)?.toLowerCase()
  const userRole = (user?.user_metadata?.role as string | undefined)?.toLowerCase()

  if (appRole === "admin" || userRole === "admin" || email === "admin@silveroak.edu" || email.includes("admin")) {
    return "admin"
  }
  if (
    appRole === "faculty" ||
    userRole === "faculty" ||
    email.includes("faculty") ||
    email === "asharma@silveroak.edu" ||
    email === "npatel@silveroak.edu" ||
    email.startsWith("prof.") ||
    email.startsWith("dr.")
  ) {
    return "faculty"
  }
  return "student"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  role: UserRole
  isAdmin: boolean
  isFaculty: boolean
  isStudent: boolean
  logout: () => Promise<void>
  switchDemoRole: (newRole: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined" || isSupabaseConfigured) return null
    const session = localStorage.getItem("campus-copilot-session") ?? sessionStorage.getItem("campus-copilot-session")
    if (!session) return null
    const detectedRole = resolveUserRole(null, session)
    const isDemoAdmin = detectedRole === "admin"
    const isDemoFaculty = detectedRole === "faculty"

    let defaultName = "Sahil Vaibhav"
    if (isDemoAdmin) defaultName = "Campus Administrator"
    else if (isDemoFaculty) defaultName = "Dr. A. Sharma"

    const displayName = localStorage.getItem("campus-copilot-name") || defaultName
    return {
      id: isDemoAdmin ? "demo-admin" : isDemoFaculty ? "demo-faculty" : "demo-student",
      email: session,
      app_metadata: { role: detectedRole },
      user_metadata: { full_name: displayName, role: detectedRole },
      aud: "authenticated",
      created_at: new Date().toISOString()
    } as User
  })
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    localStorage.removeItem("campus-copilot-session")
    sessionStorage.removeItem("campus-copilot-session")
    setUser(null)
  }

  const role: UserRole = resolveUserRole(user)
  const isAdmin = role === "admin"
  const isFaculty = role === "faculty"
  const isStudent = role === "student"

  const switchDemoRole = (newRole: UserRole) => {
    let email = "sahil.v@silveroak.edu"
    let name = "Sahil Vaibhav"
    if (newRole === "admin") {
      email = "admin@silveroak.edu"
      name = "Campus Administrator"
    } else if (newRole === "faculty") {
      email = "asharma@silveroak.edu"
      name = "Dr. A. Sharma"
    }
    localStorage.setItem("campus-copilot-session", email)
    localStorage.setItem("campus-copilot-name", name)
    const newUser = {
      id: `demo-${newRole}`,
      email,
      app_metadata: { role: newRole },
      user_metadata: { full_name: name, role: newRole },
      aud: "authenticated",
      created_at: new Date().toISOString()
    } as User
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, role, isAdmin, isFaculty, isStudent, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
