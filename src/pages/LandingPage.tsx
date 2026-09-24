import React from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Sparkles, Calendar, BookOpen, Bell, ArrowRight, GraduationCap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-card">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <GraduationCap className="h-6 w-6" />
          <span>Campus Copilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <Badge />
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mt-6 max-w-3xl">
          Your Campus, <span className="text-primary">One Conversation Away.</span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
          Campus Copilot brings schedules, notices, library services, faculty information, and campus support into one intelligent assistant.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link to="/login">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
            <Link to="/dashboard">Explore Demo</Link>
          </Button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full text-left">
          <FeatureCard 
            icon={<Sparkles className="h-6 w-6 text-primary" />}
            title="AI Campus Assistant"
            description="Ask anything about your campus, timetable, or events and get instant intelligent answers."
          />
          <FeatureCard 
            icon={<Calendar className="h-6 w-6 text-primary" />}
            title="Smart Timetable"
            description="Never miss a class. Keep track of your daily schedule, rooms, and faculty effortlessly."
          />
          <FeatureCard 
            icon={<Bell className="h-6 w-6 text-primary" />}
            title="Campus Notices"
            description="Stay updated with important announcements, examination schedules, and events."
          />
        </div>
      </main>
      
      <footer className="py-6 text-center border-t text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Campus Copilot. PBL Project.
      </footer>
    </div>
  )
}

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium">
      <Sparkles className="h-4 w-4 text-primary" />
      <span>Smart & Clean Campus AI</span>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-sm transition-all">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
