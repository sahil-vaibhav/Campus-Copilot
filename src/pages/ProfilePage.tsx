import React from "react"
import { Card, CardContent } from "../components/ui/Card"
import { Avatar, AvatarFallback } from "../components/ui/Avatar"
import { currentUser } from "../data/mock"

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <Card>
        <CardContent className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl">{currentUser.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="space-y-4 flex-1 text-center sm:text-left">
            <div>
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <p className="text-muted-foreground">{currentUser.role} • {currentUser.department}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Enrollment No.</div>
                <div>{currentUser.enrollmentNo}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Semester</div>
                <div>{currentUser.semester}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{currentUser.email}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
