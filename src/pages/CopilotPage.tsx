import React, { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar"
import {
  Plus,
  ArrowUp,
  Bot,
  RefreshCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Check,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { campusAiService } from "../services/ai/campus-ai.service"
import { useAuth } from "../contexts/AuthContext"
import { currentUser } from "../data/mock"
import { MarkdownContent } from "../components/chat/MarkdownContent"

type Message = {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: string
  source?: string
}

const SUGGESTIONS_BY_LANG: Record<string, string[]> = {
  English: [
    "What's my timetable today?",
    "When is my next DBMS class?",
    "Show today's notices.",
    "Find books on artificial intelligence.",
    "Where is the CSE department?",
    "Who teaches Operating Systems?",
  ],
  Hindi: [
    "आज का मेरा टाइमटेबल क्या है?",
    "मेरी अगली DBMS क्लास कब है?",
    "आज के मुख्य नोटिस दिखाओ।",
    "आर्टिफिशियल इंटेलिजेंस की किताबें ढूँढो।",
    "CSE डिपार्टमेंट कहाँ है?",
    "ऑपरेटिंग सिस्टम कौन पढ़ाता है?",
  ],
  Gujarati: [
    "આજનું મારું ટાઇમટેબલ શું છે?",
    "મારી આગલી DBMS ક્લાસ ક્યારે છે?",
    "આજના નોટિસ બતાવો.",
    "AI પુસ્તકો શોધો.",
    "CSE વિભાગ ક્યાં છે?",
    "ઓપરેટિંગ સિસ્ટમ કોણ ભણાવે છે?",
  ],
}

export default function CopilotPage() {
  const { user } = useAuth()

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    localStorage.getItem("campus-copilot-name") ||
    currentUser.name

  const initials =
    displayName
      .split(" ")
      .map((n: string) => n[0])
      .filter(Boolean)
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U"

  const avatarUrl = user?.user_metadata?.avatar_url
  const firstName = displayName.trim().split(/\s+/)[0] || "there"

  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("campus-copilot-language") || "English"
    } catch {
      return "English"
    }
  })

  useEffect(() => {
    const handleLangSync = () => {
      try {
        const stored = localStorage.getItem("campus-copilot-language") || "English"
        setLanguage(stored)
      } catch {}
    }
    window.addEventListener("storage", handleLangSync)
    window.addEventListener("campus-language-changed", handleLangSync)
    return () => {
      window.removeEventListener("storage", handleLangSync)
      window.removeEventListener("campus-language-changed", handleLangSync)
    }
  }, [])

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    try {
      localStorage.setItem("campus-copilot-language", newLang)
      window.dispatchEvent(new Event("campus-language-changed"))
    } catch {}
  }

  const [conversation, setConversation] = useState<Message[]>([])
  const [isCleared, setIsCleared] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const initialGreeting: Message = React.useMemo(() => {
    let content = `Hi ${firstName}! I'm your Campus Copilot. I can help you with your timetable, notices, library books, and campus services. What can I help you with today?`
    if (language === "Hindi") {
      content = `नमस्ते ${firstName}! मैं आपका कैंपस कोपायलट हूँ। मैं आपके टाइमटेबल, नोटिस, लाइब्रेरी बुक्स और कैंपस सुविधाओं में मदद कर सकता हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?`
    } else if (language === "Gujarati") {
      content = `નમસ્તે ${firstName}! હું તમારો કેમ્પસ કોપાયલટ છું. હું તમારા સમયપત્રક, નોટિસ, પુસ્તકાલયના પુસ્તકો અને કેમ્પસ સેવાઓમાં તમારી મદદ કરી શકું છું. આજે હું તમારી શું મદદ કરી શકું?`
    }
    return {
      id: "1",
      role: "ai",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "Campus Copilot",
    }
  }, [firstName, language])

  const messages: Message[] = React.useMemo(
    () => (isCleared ? conversation : [initialGreeting, ...conversation]),
    [isCleared, conversation, initialGreeting]
  )

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleCopy = (id: string, text: string) => {
    void navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    const currentHistory = conversation.map((m) => ({ role: m.role, content: m.content }))
    setConversation((prev) => [...prev, userMsg])
    setIsCleared(false)
    setInput("")
    setIsTyping(true)

    try {
      const answer = await campusAiService.ask(text, currentHistory, displayName, language)
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        content: answer.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: answer.source,
      }
      setConversation((prev) => [...prev, aiMsg])
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content: "I couldn't reach campus information just now. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full w-full bg-background overflow-hidden">
      {/* Top action controls (Language & Clear) */}
      <div className="flex items-center justify-end border-b border-border/40 px-4 md:px-8 py-2 bg-background/80 backdrop-blur-md shrink-0">

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-muted/70 px-2 py-0.5 border border-border/40 text-[11px] text-muted-foreground">
            <Globe className="h-3 w-3" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent border-0 text-[11px] font-medium text-foreground cursor-pointer focus:outline-none pr-1"
              aria-label="Select conversation language"
            >
              <option value="English" className="bg-popover text-popover-foreground">English</option>
              <option value="Hindi" className="bg-popover text-popover-foreground">Hindi (हिंदी)</option>
              <option value="Gujarati" className="bg-popover text-popover-foreground">Gujarati (ગુજરાતી)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCleared(true)
              setConversation([])
            }}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">Clear</span>
          </button>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 md:gap-4 max-w-[92%] md:max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <Avatar className="h-8 w-8 mt-1 shrink-0">
                {msg.role === "user" ? (
                  <>
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div
                className={cn(
                  "flex flex-col gap-1.5",
                  msg.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm md:text-[15px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-muted/90 dark:bg-[#2f2f2f] text-foreground rounded-tr-sm whitespace-pre-wrap break-words border border-border/30"
                      : "bg-muted/50 dark:bg-[#1e1e1e] rounded-tl-sm text-foreground overflow-hidden border border-border/30"
                  )}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <MarkdownContent content={msg.content} />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
                  <span>{msg.timestamp}</span>
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-1.5 ml-1">
                      {msg.source && <span className="mr-1 text-[10px] text-muted-foreground/75 font-mono">{msg.source}</span>}
                      <button
                        type="button"
                        aria-label="Copy response"
                        title="Copy response"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="rounded p-1 hover:text-foreground focus-visible:outline-none transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label="Helpful"
                        title="Helpful"
                        className="rounded p-1 hover:text-foreground focus-visible:outline-none transition-colors"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Not helpful"
                        title="Not helpful"
                        className="rounded p-1 hover:text-foreground focus-visible:outline-none transition-colors"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Regenerate response"
                        title="Regenerate response"
                        onClick={() => {
                          const previous = conversation
                            .filter((item) => item.role === "user")
                            .pop()
                          if (previous) void handleSend(previous.content)
                        }}
                        className="rounded p-1 hover:text-foreground focus-visible:outline-none transition-colors"
                      >
                        <RefreshCcw className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                {msg.role === "ai" && msg.source && (
                  <span className="sr-only">Source: {msg.source}</span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 md:gap-4 max-w-[92%] md:max-w-[85%]">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 dark:bg-[#1e1e1e] border border-border/30 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 w-16">
                <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom prompt input bar — GPT style capsule */}
      <div className="px-4 md:px-8 pb-4 pt-1 shrink-0 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-3xl mx-auto space-y-2.5">
          {/* Quick suggestions chips */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 justify-center pb-1">
              {(SUGGESTIONS_BY_LANG[language] || SUGGESTIONS_BY_LANG.English).map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/50 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Capsule input container matching Image 2 */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="relative flex items-center gap-1.5 rounded-full bg-[#f4f4f4] dark:bg-[#212121] border border-border/60 dark:border-white/10 px-2.5 py-1.5 shadow-lg transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 min-h-[52px]"
          >
            {/* Left Plus button */}
            <button
              type="button"
              onClick={() => {
                inputRef.current?.focus()
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Add attachment or prompt"
              aria-label="Add attachment"
            >
              <Plus className="h-5 w-5" />
            </button>

            {/* Input field */}
            <input
              ref={inputRef}
              type="text"
              aria-label="Ask Campus Copilot"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything"
              className="flex-1 bg-transparent px-2 text-sm md:text-base text-foreground placeholder:text-muted-foreground/50 border-0 outline-none focus:outline-none focus:ring-0 min-w-0"
            />

            {/* Send button */}
            <div className="flex items-center shrink-0 pr-1">
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || isTyping}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all shadow-sm focus-visible:outline-none",
                  input.trim() && !isTyping
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-100 cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                )}
                title="Send message"
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                <span className="sr-only">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
