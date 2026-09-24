import React, { useState } from "react"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { timetableMock } from "../data/mock"
import { ChevronLeft, ChevronRight, Clock, MapPin, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState("Monday")

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">Manage your classes and schedule.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-sm w-32 text-center">This Week</span>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
        {DAYS.map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? "default" : "outline"}
            onClick={() => setActiveDay(day)}
            className="rounded-full flex-shrink-0"
          >
            {day}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {timetableMock.map((cls, i) => (
          <Card key={cls.id} className={cn("overflow-hidden transition-all hover:shadow-md", i === 0 && activeDay === "Monday" ? "border-primary shadow-sm ring-1 ring-primary/20" : "")}>
            <div className="flex flex-col sm:flex-row">
              <div className={cn(
                "sm:w-48 p-6 flex flex-col justify-center sm:border-r bg-muted/20",
                i === 0 && activeDay === "Monday" ? "bg-primary/5 text-primary" : ""
              )}>
                <div className="flex items-center gap-2 font-bold text-xl">
                  <Clock className="h-5 w-5" />
                  {cls.time.split(" ")[0]}
                </div>
                <div className="text-sm opacity-70 ml-7">{cls.time.split(" ")[1]} - {cls.endTime}</div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={cls.type === "Lecture" ? "default" : "secondary"}>
                      {cls.type}
                    </Badge>
                    {i === 0 && activeDay === "Monday" && (
                      <Badge variant="destructive" className="animate-pulse">Ongoing</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{cls.subject}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {cls.room}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      Prof. Name
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Button variant="outline">Details</Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
        {activeDay !== "Monday" && (
          <div className="text-center p-12 border rounded-xl border-dashed">
            <p className="text-muted-foreground">No classes scheduled for {activeDay}.</p>
          </div>
        )}
      </div>
    </div>
  )
}
