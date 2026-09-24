import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { GraduationCap } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login, go to dashboard
    navigate("/dashboard")
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
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                placeholder="student@silveroak.edu"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
                defaultValue="sahil.v@silveroak.edu"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                  Password
                </label>
                <Link to="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                defaultValue="password123"
              />
            </div>
            <Button className="w-full mt-2" type="submit">
              Sign In
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="#" className="underline underline-offset-4 hover:text-primary">
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
