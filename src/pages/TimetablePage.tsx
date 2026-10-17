import React, { useState } from "react"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { timetableMock, facultyMock } from "../data/mock"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  BookOpen,
  Calendar,
  Bell,
  BellRing,
  Bot,
  Mail,
  X,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

type TimetableItem = (typeof timetableMock)[number]

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState("Monday")
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedClass, setSelectedClass] = useState<TimetableItem | null>(null)
  const [reminders, setReminders] = useState<Record<number, boolean>>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const activeClasses = timetableMock.filter((classItem) => classItem.day === activeDay)

  const weekLabel = React.useMemo(() => {
    if (weekOffset === 0) return "This Week"
    if (weekOffset === 1) return "Next Week"
    if (weekOffset === -1) return "Last Week"
    return weekOffset > 0 ? `+${weekOffset} Weeks` : `${weekOffset} Weeks`
  }, [weekOffset])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const toggleReminder = (id: number, subject: string) => {
    setReminders((prev) => {
      const nextState = !prev[id]
      showToast(nextState ? `Reminder set for ${subject} (15m before)` : `Reminder removed for ${subject}`)
      return { ...prev, [id]: nextState }
    })
  }

  const getFacultyForSubject = (subject: string) => {
    return (
      facultyMock.find((f) => subject.toLowerCase().includes(f.subject.toLowerCase())) ||
      facultyMock.find((f) => f.subject.toLowerCase().includes(subject.toLowerCase())) || {
        name: "Prof. N. Patel",
        email: "npatel@silveroak.edu",
        office: "Block A, Room 405",
      }
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Week Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">Manage your classes and schedule.</p>
        </div>

        {/* Interactive Week Switcher */}
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev - 1)}
            aria-label="Previous week"
            className="h-8 w-8 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className={cn(
              "font-medium text-xs sm:text-sm px-3 py-1 rounded-lg transition-colors min-w-[100px] text-center",
              weekOffset === 0
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Click to return to This Week"
          >
            {weekLabel}
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev + 1)}
            aria-label="Next week"
            className="h-8 w-8 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
        {DAYS.map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? "default" : "outline"}
            onClick={() => setActiveDay(day)}
            className={cn(
              "rounded-full flex-shrink-0 transition-all text-xs sm:text-sm h-9 px-4",
              activeDay === day ? "shadow-sm shadow-primary/25" : ""
            )}
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Class Schedule Cards */}
      <div className="grid gap-4">
        {activeClasses.map((cls, i) => {
          const hasReminder = Boolean(reminders[cls.id])
          const faculty = getFacultyForSubject(cls.subject)

          return (
            <Card
              key={cls.id}
              className={cn(
                "overflow-hidden transition-all hover:shadow-md cursor-pointer group border-border/60",
                i === 0 && activeDay === "Monday" && weekOffset === 0
                  ? "border-primary shadow-sm ring-1 ring-primary/20"
                  : ""
              )}
              onClick={() => setSelectedClass(cls)}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Time section */}
                <div
                  className={cn(
                    "sm:w-48 p-6 flex flex-col justify-center sm:border-r bg-muted/20",
                    i === 0 && activeDay === "Monday" && weekOffset === 0
                      ? "bg-primary/5 text-primary"
                      : ""
                  )}
                >
                  <div className="flex items-center gap-2 font-bold text-xl">
                    <Clock className="h-5 w-5" />
                    {cls.time.split(" ")[0]}
                  </div>
                  <div className="text-sm opacity-70 ml-7">
                    {cls.time.split(" ")[1]} - {cls.endTime}
                  </div>
                </div>

                {/* Content section */}
                <CardContent className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={cls.type === "Lecture" ? "default" : "secondary"}>
                        {cls.type}
                      </Badge>
                      {i === 0 && activeDay === "Monday" && weekOffset === 0 && (
                        <Badge variant="destructive" className="animate-pulse">
                          Ongoing
                        </Badge>
                      )}
                      {hasReminder && (
                        <Badge variant="outline" className="border-primary/40 text-primary gap-1">
                          <BellRing className="h-3 w-3" /> Reminder On
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {cls.subject}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {cls.room}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {cls.professor || faculty.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleReminder(cls.id, cls.subject)
                      }}
                      className="rounded-xl h-9 px-3 gap-1.5"
                      title={hasReminder ? "Remove reminder" : "Set reminder"}
                    >
                      {hasReminder ? (
                        <BellRing className="h-4 w-4 text-primary" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                      <span className="hidden md:inline">{hasReminder ? "Reminded" : "Remind"}</span>
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedClass(cls)
                      }}
                      className="rounded-xl h-9 px-4"
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          )
        })}

        {activeClasses.length === 0 && (
          <div className="text-center p-12 border rounded-2xl border-dashed bg-muted/10 space-y-3">
            <Calendar className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="text-muted-foreground font-medium">No classes scheduled for {activeDay}.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveDay("Monday")}
              className="rounded-xl"
            >
              Switch to Monday
            </Button>
          </div>
        )}
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedClass(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl text-card-foreground space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={selectedClass.type === "Lecture" ? "default" : "secondary"}>
                    {selectedClass.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{selectedClass.day}</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{selectedClass.subject}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setSelectedClass(null)}
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border bg-muted/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Time & Duration
                </div>
                <div className="font-semibold text-foreground">
                  {selectedClass.time} - {selectedClass.endTime}
                </div>
                <div className="text-[11px] text-muted-foreground">1 Hour Session</div>
              </div>

              <div className="rounded-xl border bg-muted/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </div>
                <div className="font-semibold text-foreground">{selectedClass.room}</div>
                <div className="text-[11px] text-muted-foreground">Academic Block A</div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="rounded-xl border p-3.5 bg-muted/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {selectedClass.professor?.split(" ")[1]?.[0] || "P"}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Instructor</div>
                  <div className="font-semibold text-sm">
                    {selectedClass.professor || getFacultyForSubject(selectedClass.subject).name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {getFacultyForSubject(selectedClass.subject).office}
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${getFacultyForSubject(selectedClass.subject).email}`}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline px-2.5 py-1.5 rounded-lg hover:bg-primary/5 transition-colors border border-primary/20"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
            </div>

            {/* Action buttons inside modal */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <Button
                variant={reminders[selectedClass.id] ? "secondary" : "outline"}
                size="sm"
                onClick={() => toggleReminder(selectedClass.id, selectedClass.subject)}
                className="gap-1.5 rounded-xl text-xs"
              >
                {reminders[selectedClass.id] ? (
                  <>
                    <BellRing className="h-3.5 w-3.5 text-primary" /> Reminder Active
                  </>
                ) : (
                  <>
                    <Bell className="h-3.5 w-3.5" /> Set Reminder
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedClass(null)
                    window.location.assign("/copilot")
                  }}
                  className="gap-1.5 rounded-xl text-xs"
                >
                  <Bot className="h-3.5 w-3.5 text-primary" /> Ask Copilot
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSelectedClass(null)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
