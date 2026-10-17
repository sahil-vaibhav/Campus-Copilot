import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { currentUser, timetableMock, noticesMock } from "../data/mock"
import { BookOpen, Calendar, MessageSquare, AlertCircle, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Student"
  const todaysClasses = timetableMock.filter((classItem) => classItem.day === "Monday")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Good morning, {firstName} 👋</h1>
        <p className="text-muted-foreground">Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.attendance}%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysClasses.length}</div>
            <p className="text-xs text-muted-foreground">For today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Notices</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">4</div>
            <p className="text-xs text-muted-foreground">2 marked as important</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Library Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Issued to you</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>You have {todaysClasses.length} classes today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysClasses.map((cls) => (
                <div key={cls.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{cls.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.room} • {cls.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{cls.time}</p>
                    <p className="text-xs text-muted-foreground">{cls.endTime}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/timetable">View Full Timetable</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Important Notices</CardTitle>
            <CardDescription>Recent announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {noticesMock.slice(0, 3).map((notice) => (
                <div key={notice.id} className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{notice.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{notice.date}</span>
                      <span>•</span>
                      <span>{notice.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6" asChild>
              <Link to="/notices">View All Notices</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/copilot">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2 text-center h-full">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm">Ask Copilot</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/timetable">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2 text-center h-full">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm">Timetable</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/library">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2 text-center h-full">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm">Library</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/services">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 gap-2 text-center h-full">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm">Campus Services</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
