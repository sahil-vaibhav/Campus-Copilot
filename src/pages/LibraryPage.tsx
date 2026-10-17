import React, { useMemo, useState } from "react"
import { Card, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { libraryBooksMock } from "../data/mock"
import { Search, Book, BookmarkPlus } from "lucide-react"

export default function LibraryPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All categories")
  const [borrowed, setBorrowed] = useState<number[]>([])
  const categories = ["All categories", ...new Set(libraryBooksMock.map((book) => book.category))]
  const books = useMemo(() => libraryBooksMock.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || book.category === category)), [query, category])
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Library</h1>
        <p className="text-muted-foreground">Search and manage campus library resources.</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input aria-label="Search books" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books by title, author, or category..." className="pl-8" />
        </div>
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id}>
            <CardContent className="p-6 flex flex-col h-full gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Book className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline">{book.category}</Badge>
                  {book.available ? (
                    <Badge className="bg-success text-success-foreground hover:bg-success/90">Available</Badge>
                  ) : (
                    <Badge variant="secondary">Due {book.returnDate}</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" disabled={!book.available || borrowed.includes(book.id)} onClick={() => setBorrowed((items) => [...items, book.id])}>
                <BookmarkPlus className="mr-2 h-4 w-4" /> 
                {borrowed.includes(book.id) ? "Request sent" : book.available ? "Borrow" : "Unavailable"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {books.length === 0 && <div className="rounded-xl border border-dashed p-10 text-center"><Book className="mx-auto mb-3 h-8 w-8 text-muted-foreground" /><p className="font-medium">No books found</p><p className="text-sm text-muted-foreground">Try a different title, author, or category.</p></div>}
    </div>
  )
}
