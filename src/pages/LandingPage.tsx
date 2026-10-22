import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Sparkles, Calendar, BookOpen, Bell, ArrowRight, GraduationCap, Users, Layers } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { ThemeToggle } from "../components/ThemeToggle"

export default function LandingPage() {
  const { user, loading, role } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (role === "admin") navigate("/admin", { replace: true })
      else if (role === "faculty") navigate("/faculty-portal", { replace: true })
      else navigate("/dashboard", { replace: true })
    }
  }, [user, loading, role, navigate])

  if (loading) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <GraduationCap className="h-6 w-6" />
          <span>Campus Copilot</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Smart &amp; Clean Campus using AI — PBL Project</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Your Campus,{" "}
          <span className="text-primary">One Conversation Away.</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
          Campus Copilot brings schedules, notices, library services, faculty information, and campus support into one intelligent assistant.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link to="/register">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>

        <section aria-label="Campus Copilot preview" className="mt-16 w-full max-w-4xl rounded-2xl border bg-card p-4 text-left shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></div>
            <div><h2 className="font-semibold">Campus Copilot</h2><p className="text-xs text-muted-foreground">Your intelligent campus assistant</p></div>
            <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-green-500" />Ready to help</span>
          </div>
          <div className="ml-auto max-w-md rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">What’s next on my timetable today?</div>
          <div className="mt-4 flex max-w-xl items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm"><p>Your next class is <strong>Data Structures</strong> at 9:00 AM in Room 302.</p><p className="mt-3 text-xs text-muted-foreground">Source: Timetable · Updated today</p></div>
          </div>
        </section>

        {/* 3 Dedicated Campus Portals */}
        <div className="mt-20 w-full max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Three Dedicated Campus Portals</h2>
            <p className="text-muted-foreground text-sm mt-1">Tailored experiences built specifically for Students, Faculty, and University Administrators.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="rounded-2xl border bg-card p-6 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Student Portal</h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Academic hub for learners</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Daily timetable, lecture alerts, central library search, attendance tracking, and 24/7 AI Copilot queries.
                </p>
              </div>
              <Button variant="outline" className="mt-6 w-full gap-2" asChild>
                <Link to="/login">
                  Enter Student Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm hover:border-blue-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Faculty Portal</h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Teaching &amp; academic operations</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Interactive attendance roll call, teaching timetable, department notices publishing, student inquiry resolution, and AI quiz generator.
                </p>
              </div>
              <Button variant="outline" className="mt-6 w-full gap-2" asChild>
                <Link to="/login">
                  Enter Faculty Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm hover:border-purple-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Admin Portal</h3>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Governance &amp; university control</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  User accounts and role assignment, campus-wide notice management, grievance tracking, and database synchronization.
                </p>
              </div>
              <Button variant="outline" className="mt-6 w-full gap-2" asChild>
                <Link to="/login">
                  Enter Admin Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="mt-24 grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full text-left">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3 p-6 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-sm transition-all">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24 max-w-3xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-2">How it works</h2>
          <p className="text-muted-foreground mb-10">Getting campus info has never been this fast.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Ask", "Understand", "Find", "Answer"].map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>
                <span className="font-semibold">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 p-10 rounded-2xl bg-primary/5 border max-w-3xl mx-auto w-full">
          <h2 className="text-3xl font-bold">Make campus life simpler.</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Join students already using Campus Copilot at Silver Oak University.
          </p>
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link to="/register">
              Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="py-6 text-center border-t text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Campus Copilot — Silver Oak University. PBL Project.
      </footer>
    </div>
  )
}

const features = [
  { icon: <Sparkles className="h-6 w-6" />, title: "AI Campus Assistant", description: "Ask anything about your campus, timetable, or events and get instant intelligent answers." },
  { icon: <Calendar className="h-6 w-6" />, title: "Smart Timetable", description: "Never miss a class. Keep track of your daily schedule, rooms, and faculty effortlessly." },
  { icon: <Bell className="h-6 w-6" />, title: "Campus Notices", description: "Stay updated with important announcements, examination schedules, and events." },
  { icon: <BookOpen className="h-6 w-6" />, title: "Library Assistant", description: "Search, browse, and borrow books from the campus library with one tap." },
  { icon: <Users className="h-6 w-6" />, title: "Faculty Directory", description: "Find any faculty member, their office location, contact, and subjects taught." },
  { icon: <Layers className="h-6 w-6" />, title: "Campus Services", description: "Access canteen, transport, medical, IT support and other services in one place." },
]
