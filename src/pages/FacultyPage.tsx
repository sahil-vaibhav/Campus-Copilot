import React, { useMemo, useState } from "react"
import { Card, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { facultyMock } from "../data/mock"
import { Search, Mail, MapPin, BookOpen } from "lucide-react"
import { Avatar, AvatarFallback } from "../components/ui/Avatar"

export default function FacultyPage() {
  const [query, setQuery] = useState("")
  const faculty = useMemo(() => facultyMock.filter((item) => `${item.name} ${item.department} ${item.subject}`.toLowerCase().includes(query.toLowerCase())), [query])
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Faculty Directory</h1>
        <p className="text-muted-foreground">Find and contact your professors.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input aria-label="Search faculty" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, subject, or department..." className="pl-8" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculty.map((faculty) => (
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
                <a href={`mailto:${faculty.email}`} className="flex items-center gap-2 text-primary hover:underline">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{faculty.email}</span>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {faculty.length === 0 && <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">No faculty match that search.</p>}
    </div>
  )
}
