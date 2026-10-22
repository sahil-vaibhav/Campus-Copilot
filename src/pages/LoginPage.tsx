import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { GraduationCap } from "lucide-react"
import { isSupabaseConfigured, supabase } from "../lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [remember, setRemember] = useState(true)

  const fillDemo = (role: "student" | "faculty" | "admin") => {
    if (role === "student") {
      setEmail("sahil.v@silveroak.edu")
      setPassword("StudentPassword123!")
    } else if (role === "faculty") {
      setEmail("asharma@silveroak.edu")
      setPassword("FacultyPassword123!")
    } else {
      setEmail("admin@silveroak.edu")
      setPassword("AdminPassword123!")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Role detection helper
    const detectPortalUrl = (userRole?: string | null, userEmail?: string): string => {
      const em = (userEmail || email).toLowerCase().trim()
      const r = (userRole || "").toLowerCase().trim()

      if (r === "admin" || em === "admin@silveroak.edu" || em.includes("admin")) {
        return "/admin"
      }
      if (
        r === "faculty" ||
        em.includes("faculty") ||
        em === "asharma@silveroak.edu" ||
        em === "npatel@silveroak.edu" ||
        em.startsWith("prof.") ||
        em.startsWith("dr.")
      ) {
        return "/faculty-portal"
      }
      return "/dashboard"
    }

    if (!isSupabaseConfigured || !supabase) {
      if (!email.includes("@") || password.length < 6) {
        setError("Enter a valid email and a password with at least 6 characters.")
        setLoading(false)
        return
      }
      if (remember) localStorage.setItem("campus-copilot-session", email)
      else sessionStorage.setItem("campus-copilot-session", email)

      const targetUrl = detectPortalUrl(null, email)
      let defaultName = "Sahil Vaibhav"
      if (targetUrl === "/admin") {
        defaultName = "Campus Administrator"
      } else if (targetUrl === "/faculty-portal") {
        defaultName = "Dr. A. Sharma"
      } else if (email !== "sahil.v@silveroak.edu") {
        defaultName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      }

      localStorage.setItem("campus-copilot-name", defaultName)
      window.location.assign(targetUrl)
      return
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      const userRole = data.user?.app_metadata?.role || data.user?.user_metadata?.role
      const targetUrl = detectPortalUrl(userRole, data.user?.email || email)
      window.location.assign(targetUrl)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-[350px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-primary mb-2" />
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your Silver Oak University Portal
            </p>

            {/* Quick Portal Switcher Buttons */}
            <div className="rounded-xl border bg-muted/40 p-2.5 space-y-1.5 text-left">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">
                Quick Select Portal
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => fillDemo("student")}
                  className="rounded-lg border bg-background px-2 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary transition-all text-center flex flex-col items-center justify-center gap-0.5"
                >
                  <span>🎓 Student</span>
                  <span className="text-[9px] text-muted-foreground font-normal">sahil.v@</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("faculty")}
                  className="rounded-lg border bg-background px-2 py-1.5 text-xs font-semibold hover:border-blue-500 hover:text-blue-600 transition-all text-center flex flex-col items-center justify-center gap-0.5"
                >
                  <span>👨‍🏫 Faculty</span>
                  <span className="text-[9px] text-muted-foreground font-normal">asharma@</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("admin")}
                  className="rounded-lg border bg-background px-2 py-1.5 text-xs font-semibold hover:border-purple-500 hover:text-purple-600 transition-all text-center flex flex-col items-center justify-center gap-0.5"
                >
                  <span>🛡️ Admin</span>
                  <span className="text-[9px] text-muted-foreground font-normal">admin@</span>
                </button>
              </div>
            </div>

            {!isSupabaseConfigured && <p className="rounded-lg border border-primary/20 bg-primary/5 p-2 text-left text-xs text-muted-foreground">Demo mode: select any role above or enter custom credentials to open the portal.</p>}
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive border border-destructive/50 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                placeholder="student@silveroak.edu"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-primary" /> Remember me
            </label>
            <Button className="w-full mt-2" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="underline underline-offset-4 hover:text-primary">
              Register here
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col justify-between bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <GraduationCap className="h-6 w-6" />
          Campus Copilot
        </div>
        <div className="max-w-md">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "This app transformed how I navigate my college life. Everything from my timetable to campus notices is just one conversation away."
            </p>
            <footer className="text-sm">— Student Testimonial</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
