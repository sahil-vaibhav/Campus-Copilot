import React from "react"
import { Card, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { facultyMock } from "../data/mock"
import { Search, Mail, MapPin, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback } from "../components/ui/Avatar"

export default function FacultyPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Faculty Directory</h1>
        <p className="text-muted-foreground">Find and contact your professors.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or department..." className="pl-8" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facultyMock.map((faculty) => (
          <Card key={faculty.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{faculty.name.split(" ").map(n => n[0]).join("").substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{faculty.name}</h3>
                  <p className="text-sm text-muted-foreground">{faculty.department} Department</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>{faculty.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{faculty.office}</span>
                </div>
                <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{faculty.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
