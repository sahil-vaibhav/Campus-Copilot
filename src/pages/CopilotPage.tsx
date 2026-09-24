import React, { useState, useRef, useEffect } from "react"
import { Card } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Avatar, AvatarFallback } from "../components/ui/Avatar"
import { Send, Bot, User, Sparkles, RefreshCcw, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: string
}

const SUGGESTIONS = [
  "What's my timetable today?",
  "Show today's notices.",
  "Find books on artificial intelligence.",
  "Where is the CSE department?"
]

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hi Sahil! I'm your Campus Copilot. I can help you with your timetable, notices, library books, and campus services. What can I help you with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (text: string = input) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Mock AI response
    setTimeout(() => {
      let aiResponse = "I'm sorry, I couldn't understand that. Could you try asking about your timetable, notices, or library books?"
      
      const lowerText = text.toLowerCase()
      if (lowerText.includes("timetable") || lowerText.includes("class")) {
        aiResponse = "Your next class is Data Structures at 09:00 AM in Room 302. You have Database Management at 11:00 AM in Lab 4."
      } else if (lowerText.includes("notice")) {
        aiResponse = "There are 4 unread notices. The most recent important notice is about the Mid-Semester Examination Schedule."
      } else if (lowerText.includes("book") || lowerText.includes("library") || lowerText.includes("artificial intelligence")) {
        aiResponse = "'Artificial Intelligence: A Modern Approach' by Stuart Russell is currently available in the Computer Science section of the library."
      } else if (lowerText.includes("where") && lowerText.includes("cse")) {
        aiResponse = "The Computer Science & Engineering (CSE) department is located in Block A, 4th Floor."
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col max-w-4xl mx-auto border rounded-xl overflow-hidden bg-card">
      <div className="flex items-center gap-3 border-b p-4 bg-muted/30">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Campus Copilot</h2>
          <p className="text-xs text-muted-foreground">Your intelligent campus assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <Avatar className="h-8 w-8 mt-1 shrink-0">
              {msg.role === "user" ? (
                <AvatarFallback className="bg-primary/10 text-primary">SV</AvatarFallback>
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className={cn(
              "flex flex-col gap-1",
              msg.role === "user" ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "rounded-2xl px-4 py-2.5 text-sm",
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-muted rounded-tl-sm text-foreground"
              )}>
                {msg.content}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
                <span>{msg.timestamp}</span>
                {msg.role === "ai" && (
                  <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="hover:text-foreground"><Copy className="h-3 w-3" /></button>
                    <button className="hover:text-foreground"><ThumbsUp className="h-3 w-3" /></button>
                    <button className="hover:text-foreground"><ThumbsDown className="h-3 w-3" /></button>
                    <button className="hover:text-foreground"><RefreshCcw className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 max-w-[85%]">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 w-16">
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex flex-wrap gap-2 mb-3 hidden sm:flex">
          {SUGGESTIONS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSend(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your campus..." 
            className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:bg-background h-12 px-5"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-12 w-12 rounded-full shrink-0"
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
