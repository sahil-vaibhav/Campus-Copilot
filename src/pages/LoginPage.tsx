import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { GraduationCap } from "lucide-react"
import { isSupabaseConfigured, supabase } from "../lib/supabase"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [remember, setRemember] = useState(true)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!isSupabaseConfigured || !supabase) {
      if (!email.includes("@") || password.length < 6) {
        setError("Enter a valid email and a password with at least 6 characters.")
        setLoading(false)
        return
      }
      if (remember) localStorage.setItem("campus-copilot-session", email)
      else sessionStorage.setItem("campus-copilot-session", email)
      localStorage.setItem("campus-copilot-name", email === "sahil.v@silveroak.edu" ? "Sahil Vaibhav" : email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()))
      window.location.assign("/dashboard")
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
      // Redirect based on role
      const role = data.user?.user_metadata?.role
      if (role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
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
              Enter your college email to sign in to your account
            </p>
            {!isSupabaseConfigured && <p className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-left text-xs text-muted-foreground">Demo mode: any valid email and a password with at least 6 characters opens the sample workspace. Demo accounts are not secure accounts.</p>}
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
