import React, { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { isSupabaseConfigured, supabase } from "../lib/supabase"

type AuthContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined" || isSupabaseConfigured) return null
    const session = localStorage.getItem("campus-copilot-session") ?? sessionStorage.getItem("campus-copilot-session")
    const displayName = localStorage.getItem("campus-copilot-name") || "Sahil Vaibhav"
    return session ? ({ id: "demo-student", email: session, app_metadata: {}, user_metadata: { full_name: displayName, role: "student" }, aud: "authenticated", created_at: new Date().toISOString() } as User) : null
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

  // Profile metadata is user-editable and must never grant administrative access.
  const isAdmin = user?.app_metadata?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
