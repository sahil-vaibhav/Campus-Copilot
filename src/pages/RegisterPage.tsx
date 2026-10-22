import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { GraduationCap } from "lucide-react"
import { isSupabaseConfigured, supabase } from "../lib/supabase"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"student" | "faculty">("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!isSupabaseConfigured || !supabase) {
      if (password.length < 6) { setError("Use a password with at least 6 characters."); setLoading(false); return }
      localStorage.setItem("campus-copilot-session", email)
      localStorage.setItem("campus-copilot-name", name)
      window.location.assign(role === "faculty" ? "/faculty-portal" : "/dashboard")
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Because email confirmations are typically enabled by default, 
      // let's just go back to login and tell them to verify, or if disabled, they can login.
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-[350px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-primary mb-2" />
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive border border-destructive/50 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="name">
                Full Name
              </label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Sahil Vaibhav"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                autoComplete="email"
                placeholder="student@silveroak.edu"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="role">
                Account Type / Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "student" | "faculty")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="student">🎓 Student Account</option>
                <option value="faculty">👨‍🏫 Faculty Member / Professor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button className="w-full mt-2" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Create Account"}
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
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
              "This platform connects the entire campus. Whether you are a student, faculty member, or admin, you will find it intuitive."
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
