import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"

export default function FeedbackPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback & Complaints</h1>
        <p className="text-muted-foreground">We value your feedback to improve campus life.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription>Fill out the form below to share your experience or report an issue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input placeholder="E.g., Infrastructure, Academic, Cleanliness" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                placeholder="Describe your issue or feedback..." 
              />
            </div>
            <Button className="w-full">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
