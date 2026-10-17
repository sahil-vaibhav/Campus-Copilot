import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { useTheme } from "../components/theme-provider"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Moon, Sun, Monitor, Bell, Shield, Cpu, LogOut } from "lucide-react"

type Theme = "light" | "dark" | "system"

function ToggleGroup({ value, onChange, options }: { value: string; onChange: (v: Theme) => void; options: { value: Theme; label: string; icon: React.ReactNode }[] }) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            value === opt.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b last:border-0">
      <div>
        <div className="font-medium">{label}</div>
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${enabled ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [notifications, setNotifications] = React.useState(() => JSON.parse(localStorage.getItem("campus-copilot-notifications") || "null") ?? { notices: true, classes: true, feedback: false, promotions: false })
  const [personalized, setPersonalized] = React.useState(() => localStorage.getItem("campus-copilot-personalized") !== "false")
  const [language, setLanguage] = React.useState(() => localStorage.getItem("campus-copilot-language") || "English")
  const updateNotifications = (key: keyof typeof notifications, value: boolean) => {
    setNotifications((current: typeof notifications) => {
      const next = { ...current, [key]: value }
      localStorage.setItem("campus-copilot-notifications", JSON.stringify(next))
      return next
    })
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize how Campus Copilot looks on your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingRow label="Theme" description="Select your preferred color theme.">
            <ToggleGroup
              value={theme}
              onChange={setTheme}
              options={[
                { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
                { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
                { value: "system", label: "System", icon: <Monitor className="h-3.5 w-3.5" /> },
              ]}
            />
          </SettingRow>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Choose which notifications you want to receive.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingRow label="Campus Notices" description="Get notified when new notices are published.">
            <Toggle enabled={notifications.notices} onChange={(v) => updateNotifications("notices", v)} />
          </SettingRow>
          <SettingRow label="Class Reminders" description="Receive reminders before your classes start.">
            <Toggle enabled={notifications.classes} onChange={(v) => updateNotifications("classes", v)} />
          </SettingRow>
          <SettingRow label="Feedback Updates" description="Track the status changes of your feedback.">
            <Toggle enabled={notifications.feedback} onChange={(v) => updateNotifications("feedback", v)} />
          </SettingRow>
          <SettingRow label="Promotions" description="Campus events and promotional announcements.">
            <Toggle enabled={notifications.promotions} onChange={(v) => updateNotifications("promotions", v)} />
          </SettingRow>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <CardTitle>AI Preferences</CardTitle>
          </div>
          <CardDescription>Control how Campus Copilot AI behaves.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingRow label="Personalized Responses" description="AI uses your timetable and courses for context.">
            <Toggle enabled={personalized} onChange={(value) => { setPersonalized(value); localStorage.setItem("campus-copilot-personalized", String(value)) }} />
          </SettingRow>
          <SettingRow label="Response Language" description="Language for AI responses.">
            <select
              value={language}
              onChange={(event) => {
                const nextLang = event.target.value
                setLanguage(nextLang)
                localStorage.setItem("campus-copilot-language", nextLang)
                window.dispatchEvent(new Event("campus-language-changed"))
              }}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Gujarati</option>
            </select>
          </SettingRow>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Account</CardTitle>
          </div>
          <CardDescription>Manage your account and session.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingRow label="Sign Out" description="Sign out of Campus Copilot on this device.">
            <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </SettingRow>
        </CardContent>
      </Card>
    </div>
  )
}
