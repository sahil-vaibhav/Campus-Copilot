import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { noticesMock } from "../data/mock"
import { Search, Bell, ChevronRight, Pin } from "lucide-react"

const CATEGORIES = ["All", "Academic", "Examination", "Events", "Placement", "General", "Emergency"]

export default function NoticesPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [query, setQuery] = useState("")
  
  const filteredNotices = useMemo(() => noticesMock.filter(n =>
    (activeCategory === "All" || n.type === activeCategory) && `${n.title} ${n.type}`.toLowerCase().includes(query.toLowerCase())
  ), [activeCategory, query])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notices</h1>
          <p className="text-muted-foreground">Stay updated with campus announcements.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input aria-label="Search notices" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notices..." className="pl-8" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full flex-shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredNotices.map((notice) => (
          <Link to={`/notices/${notice.id}`} key={notice.id} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Card className="hover:bg-muted/30 transition-colors group">
            <CardContent className="p-4 sm:p-6 flex items-start gap-4 sm:gap-6">
              <div className="mt-1 flex-shrink-0">
                {notice.isImportant ? (
                  <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                    <Pin className="h-5 w-5 fill-destructive/20" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Bell className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{notice.type}</Badge>
                  <span className="text-xs text-muted-foreground">{notice.date}</span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{notice.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="hidden sm:flex self-center">
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card></Link>
        ))}
        {filteredNotices.length === 0 && (
          <div className="text-center p-12 border rounded-xl border-dashed">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No notices found</h3>
            <p className="text-muted-foreground">Try changing your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
