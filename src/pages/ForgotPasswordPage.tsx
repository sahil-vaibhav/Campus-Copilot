import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { isSupabaseConfigured, supabase } from "../lib/supabase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    if (isSupabaseConfigured && supabase) {
      const { error: requestError } = await supabase.auth.resetPasswordForEmail(email)
      if (requestError) { setError(requestError.message); return }
    } else {
      setError("Password reset is unavailable in demo mode. Connect the authentication service to enable it.")
      return
    }
    setSent(true)
  }
  return <main className="grid min-h-screen place-items-center p-6"><section className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
    <Link to="/" className="inline-flex items-center gap-2 font-semibold text-primary"><GraduationCap className="h-6 w-6" /> Campus Copilot</Link>
    <div><h1 className="text-2xl font-semibold">Reset your password</h1><p className="mt-2 text-sm text-muted-foreground">We’ll send a reset link to your campus email.</p></div>
    {sent ? <p role="status" className="rounded-lg bg-muted p-4 text-sm">If an account exists for {email}, you’ll receive a password reset email shortly.</p> : <form onSubmit={submit} className="space-y-4">
      <label htmlFor="reset-email" className="text-sm font-medium">Email</label><Input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@silveroak.edu" />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full">Send reset link</Button>
    </form>}
    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
  </section></main>
}
