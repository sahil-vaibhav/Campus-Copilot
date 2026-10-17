import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Avatar, AvatarFallback } from "../components/ui/Avatar"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { currentUser } from "../data/mock"
import { User, Mail, BookOpen, GraduationCap, Hash, Save, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || currentUser.name
  const email = user?.email || currentUser.email
  const role = user?.user_metadata?.role || "student"
  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()

  const [displayName, setDisplayName] = useState(name)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ data: { full_name: displayName.trim() } })
      if (error) { setSaving(false); return }
    } else {
      localStorage.setItem("campus-copilot-name", displayName.trim())
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const infoRows = [
    { label: "Enrollment No.", value: currentUser.enrollmentNo, icon: Hash },
    { label: "Department", value: currentUser.department, icon: GraduationCap },
    { label: "Semester", value: `Semester ${currentUser.semester}`, icon: BookOpen },
    { label: "Email", value: email, icon: Mail },
    { label: "Role", value: role.charAt(0).toUpperCase() + role.slice(1), icon: User },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

      {/* Avatar Card */}
      <Card>
        <CardContent className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-muted-foreground">{currentUser.department}</p>
            <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">{role}</span>
              <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">Silver Oak University</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
          <CardDescription>Your enrollment and academic details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {infoRows.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="font-medium text-sm">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {saved && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Profile updated successfully.
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={email} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Email cannot be changed from this page.</p>
            </div>
            <Button type="submit" className="gap-2" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
