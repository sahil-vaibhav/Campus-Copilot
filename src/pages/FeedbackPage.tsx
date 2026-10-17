import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { isSupabaseConfigured, supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"
import { CheckCircle2, Clock, AlertCircle, Send } from "lucide-react"

const CATEGORIES = ["Infrastructure", "Academic", "Canteen", "Library", "Transport", "IT Support", "Security", "Other"]
const PRIORITIES = ["Low", "Medium", "High", "Urgent"]

// Mock previous submissions
type FeedbackSubmission = { id: number; category: string; description: string; status: "Submitted" | "In Progress" | "Resolved"; date: string; priority: string }

const initialSubmissions: FeedbackSubmission[] = [
  { id: 1, category: "IT Support", description: "Wi-Fi is not working in the library", status: "In Progress", date: "Oct 12, 2024", priority: "High" },
  { id: 2, category: "Infrastructure", description: "AC in Room 302 is broken", status: "Resolved", date: "Oct 8, 2024", priority: "Medium" },
  { id: 3, category: "Canteen", description: "More vegetarian options needed", status: "Submitted", date: "Oct 5, 2024", priority: "Low" },
]

const statusConfig = {
  "Submitted": { icon: Clock, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  "In Progress": { icon: AlertCircle, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  "Resolved": { icon: CheckCircle2, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
}

export default function FeedbackPage() {
  const { user } = useAuth()
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>(() => JSON.parse(localStorage.getItem("campus-copilot-feedback") || "null") ?? initialSubmissions)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !description) return
    setLoading(true)
    setError("")

    if (isSupabaseConfigured && supabase) {
      const { error: dbError } = await supabase.from("feedback").insert({ user_id: user?.id, category, description, status: "Submitted", priority })
      if (dbError) { setError("We couldn’t submit your feedback. Please try again."); setLoading(false); return }
    }
    const nextSubmissions: FeedbackSubmission[] = [{ id: Date.now(), category, description, status: "Submitted", date: new Date().toLocaleDateString(), priority }, ...submissions]
    setSubmissions(nextSubmissions)
    localStorage.setItem("campus-copilot-feedback", JSON.stringify(nextSubmissions))

    setSuccess(true)
    setCategory("")
    setDescription("")
    setPriority("Medium")
    setLoading(false)
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback &amp; Complaints</h1>
        <p className="text-muted-foreground mt-1">We value your feedback to improve campus life.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Submit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>Share your experience or report an issue.</CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Feedback submitted successfully!
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <div className="flex gap-2 flex-wrap">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        priority === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  placeholder="Describe your issue or feedback in detail..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Send className="h-4 w-4" />
                {loading ? "Submitting…" : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Previous Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Your Submissions</CardTitle>
            <CardDescription>Track the status of your feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((item) => {
                const cfg = statusConfig[item.status as keyof typeof statusConfig]
                const Icon = cfg.icon
                return (
                  <div key={item.id} className="p-4 rounded-xl border bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">{item.category}</span>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                        <Icon className="h-3 w-3" />
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-muted border text-xs">{item.priority}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
