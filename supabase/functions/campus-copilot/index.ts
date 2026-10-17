// supabase/functions/campus-copilot/index.ts
// Supabase Edge Function that proxies requests to OpenRouter API
// and enriches them with campus database context.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

/** Detect the user's intent so we can fetch relevant context from the DB. */
function detectIntent(
  query: string
): "library" | "services" | "timetable" | "notices" | "faculty" | "location" | "general" {
  const text = query.toLowerCase()

  // 1. Library check (highest priority so queries like "books for DBMS" or "suggest books for subject Database" route here)
  if (/book|books|library|textbook|textbooks|borrow|shelf|reading|catalog|catalogue|किताब|पुस्तक|लाइब्रेरी|પુસ્તક|વાંચન|લાઇબ્રેરી/.test(text)) {
    return "library"
  }

  // 2. Campus services & amenities (canteen, timings, transport/bus, IT support/wifi, health/medical/doctor, security, student affairs, clubs)
  if (/canteen|cafeteria|food|meal|meals|lunch|breakfast|snack|timing|timings|schedule of canteen|canteen hour|canteen hours|open time|closing time|working hour|working hours|transport|bus|buses|shuttle|route|wifi|wi-fi|it support|password reset|medical|health center|clinic|doctor|ambulance|emergency|security|lost and found|guard|student affairs|bonafide|scholarship|club|clubs|event|events|service|services|કેન્ટીન|બસ|પરિવહન|દાક્તર|ક્લિનિક|કૅન્ટીન|भोजनालय|कैंटीन|बस|परिवहन|डॉक्टर|चिकित्सा|सुरक्षा/.test(text)) {
    return "services"
  }

  // 3. Faculty directory (checked before timetable so "Who teaches Operating Systems?" routes to faculty)
  if (/faculty|professor|professors|teacher|teachers|teaches|instructor|instructors|office|dean|hod|who teaches|प्रोफेसर|शिक्षक|અધ્યાપક/.test(text)) {
    return "faculty"
  }

  // 4. Timetable / class schedule
  if (/timetable|class|classes|schedule|lecture|lectures|lab|labs|dbms|operating system|data structure|network|artificial intelligence|software engineering|subject|subjects|period|टाइमटेबल|क्लास|कक्षा|शेड्यूल|લેક્ચર|સમયપત્રક|પિરિયડ|લેબ/.test(text)) {
    return "timetable"
  }

  // 5. Notices & announcements
  if (/notice|notices|announcement|announcements|exam|exams|holiday|holidays|circular|circulars|सूचना|नोटिस|परीक्षा|सर्कुलर|સૂચના|નોટિસ|પરીક્ષા/.test(text)) {
    return "notices"
  }

  // 6. Campus locations / navigation
  if (/where|location|room|block|building|department|floor|map|reach|कहाँ|स्थान|ક્યાં/.test(text)) {
    return "location"
  }

  return "general"
}

Deno.serve(async (req: Request) => {
  // ── CORS preflight ──
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS })
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY is not configured" }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      )
    }

    // ── Parse the incoming request body ──
    const { question, history = [], userName, language = "English" } = await req.json()

    if (!question || typeof question !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing 'question' in request body" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      )
    }

    // ── Create a Supabase client to query the database ──
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Current day & time for campus context (Asia/Kolkata timezone)
    const currentDay = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Asia/Kolkata" }).format(new Date())
    const currentTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date())

    // ── Detect intent and fetch relevant DB context ──
    const intent = detectIntent(question)
    let dbContext = ""
    let source = "Campus Copilot"

    if (intent === "timetable") {
      const { data: schedule } = await supabase
        .from("timetable")
        .select("day, subject, time, end_time, room, type")
        .order("id", { ascending: true })

      if (schedule && schedule.length > 0) {
        dbContext = `\n\nHere is the official class schedule from the database:\n` +
          schedule
            .map(
              (c: { day: string; subject: string; time: string; end_time: string; room: string; type: string }) =>
                `- ${c.day}: ${c.subject} (${c.type}) from ${c.time} to ${c.end_time} in ${c.room}`
            )
            .join("\n")
        source = `Timetable · Official schedule from database`
      }
    } else if (intent === "notices") {
      const { data: notices } = await supabase
        .from("notices")
        .select("title, content, type, is_important, created_at")
        .order("created_at", { ascending: false })
        .limit(10)

      if (notices && notices.length > 0) {
        dbContext = `\n\nHere are the latest campus notices from the database:\n${notices
          .map(
            (n: { title: string; content: string; type: string; is_important: boolean; created_at: string }) =>
              `- [${n.type}${n.is_important ? " ⚠️ IMPORTANT" : ""}] "${n.title}": ${n.content} (posted ${n.created_at})`
          )
          .join("\n")}`
        source = `Campus notices · ${notices.length} results from database`
      }
    } else if (intent === "library") {
      const { data: books } = await supabase
        .from("library_books")
        .select("title, author, category, available, return_date")
        .order("title", { ascending: true })
        .limit(50)

      if (books && books.length > 0) {
        dbContext = `\n\nHere is the live campus library catalog from the database:\n` +
          books
            .map(
              (b: { title: string; author: string; category: string; available: boolean; return_date: string | null }) =>
                `- "${b.title}" by ${b.author} [Category: ${b.category}] — Status: ${b.available ? "AVAILABLE to borrow" : `BORROWED / CHECKED OUT (Due date: ${b.return_date || "Soon"})`}`
            )
            .join("\n") +
          `\n\nCentral Library Details:\n` +
          `- Location: Library Block, Ground & 1st Floor\n` +
          `- Hours: Monday – Saturday: 08:00 AM – 08:00 PM (Closed on Sundays)\n` +
          `- Contact: library@silveroak.edu\n` +
          `- Services: Physical books issuance, quiet study areas, IEEE, Springer & ACM digital access.`
        source = `Central Library · Live Catalog & Availability`
      }
    } else if (intent === "services") {
      dbContext = `\n\nOfficial Campus Services & Timings:\n` +
        `1. Campus Canteen:\n` +
        `   - Working Hours: 08:30 AM – 06:30 PM (Monday to Saturday, Closed on Sundays)\n` +
        `   - Location: Student Center, Ground Floor\n` +
        `   - Contact: canteen@silveroak.edu\n` +
        `   - Services: Subsidized student meals, breakfast & lunch combos, tea/coffee & snacks, quick counter pickup token system (Counter 2).\n` +
        `2. Central Library:\n` +
        `   - Working Hours: 08:00 AM – 08:00 PM (Monday to Saturday, Closed on Sundays)\n` +
        `   - Location: Library Block, Ground & 1st Floor\n` +
        `   - Contact: library@silveroak.edu\n` +
        `   - Services: Over 25,000 physical textbooks, quiet study rooms, digital access.\n` +
        `3. Campus Transport & Transit (Bus Service):\n` +
        `   - Working Hours: 07:30 AM – 06:00 PM (Monday to Saturday, Closed on Sundays)\n` +
        `   - Location: Main Campus Gate Bus Terminal\n` +
        `   - Contact: +91 79 6604 7010\n` +
        `   - Services: 5 city routes covering Gandhinagar & Ahmedabad with live GPS tracking, semester student passes.\n` +
        `4. IT Support Desk:\n` +
        `   - Working Hours: 09:00 AM – 06:00 PM (Monday to Saturday, Closed on Sundays)\n` +
        `   - Location: Student Center 2nd Floor & IT Lab 1\n` +
        `   - Contact: it-support@silveroak.edu\n` +
        `   - Services: Campus High-Speed Wi-Fi logins, student ERP & portal password resets, software licenses & lab workstation support.\n` +
        `5. Health Center & Medical Clinic:\n` +
        `   - Working Hours: 24/7 Emergency Clinic & Campus Ambulance; Doctor Consultation Mon – Sat: 09:00 AM – 05:00 PM\n` +
        `   - Location: Health Center, Block A (Room 102)\n` +
        `   - Contact: +91 79 108 0000\n` +
        `   - Services: Free general consultation & first aid, essential OTC supplies, dedicated 24/7 emergency ambulance.\n` +
        `6. Campus Security Control Room:\n` +
        `   - Working Hours: 24 Hours / 7 Days a week (24/7 Active)\n` +
        `   - Location: Security Office, Gate 1 & Gate 2\n` +
        `   - Contact: +91 79 6604 7000\n` +
        `   - Services: Lost & Found registry counter, campus entry clearance, 24/7 emergency helpline.\n` +
        `7. Student Affairs Office:\n` +
        `   - Working Hours: 10:00 AM – 04:30 PM (Monday to Saturday, Closed on Sundays)\n` +
        `   - Location: Academic Block A, Room 104\n` +
        `   - Contact: studentaffairs@silveroak.edu\n` +
        `   - Services: Bonafide certificates, scholarship & fee concession guidance, student council support.\n` +
        `8. Student Clubs & Activities:\n` +
        `   - Working Hours: Online Registrations 24/7\n` +
        `   - Location: Student Activity Center & Amphitheater\n` +
        `   - Contact: clubs@silveroak.edu\n` +
        `   - Services: GDSC, Robotics & AI, Coding Clubs, Cultural societies, Annual Tech Fest.`
      source = `Campus Services & Timings`
    } else if (intent === "faculty") {
      const { data: users } = await supabase
        .from("users")
        .select("name, email, role")
        .or("role.eq.faculty,role.eq.professor,role.eq.admin")
        .limit(20)

      if (users && users.length > 0) {
        dbContext = `\n\nHere are faculty members from the database:\n${users
          .map((u: { name: string; email: string; role: string }) => `- ${u.name} (${u.role}) — ${u.email}`)
          .join("\n")}`
        source = `Faculty directory · ${users.length} results from database`
      }
    } else if (intent === "location") {
      dbContext = `\n\nHere is the campus directory and facility locations:\n` +
        `- Block A: CSE Faculty offices (Rooms 402, 405, 408, 410), Classrooms (Rooms 301, 302, 305), Health Center (Room 102), Student Affairs (Room 104)\n` +
        `- Block B: CSE Labs 2, 3, 4, Classrooms 201, 204\n` +
        `- Block C: Mathematics Department, Room 106\n` +
        `- Central Library: Library Block, Ground & 1st Floor (Hours: Mon–Sat 08:00 AM – 08:00 PM)\n` +
        `- Student Center: Ground Floor: Campus Canteen (Hours: Mon–Sat 08:30 AM – 06:30 PM); 2nd Floor: IT Support Desk (Hours: Mon–Sat 09:00 AM – 06:00 PM)\n` +
        `- Main Campus Gate: Bus Terminal (Transport service active Mon–Sat 07:30 AM – 06:00 PM)\n` +
        `- Gate 1 & Gate 2: Security Control Room & Lost and Found (24/7 Active)\n` +
        `- Innovation Hub: Project Studio, Robotics & AI Lab`
      source = `Campus Directory`
    }

    // ── Build the system prompt with campus context ──
    const systemPrompt = `You are "Campus Copilot", an intelligent AI assistant for students at Silver Oak University.
${userName ? `The current student you are conversing with is: ${userName}. Address them naturally when relevant.` : ""}
Today's reference time: ${currentDay}, ${currentTime}.
Your job is to help students with:
- Timetable and class schedules (use the official timetable provided below)
- Campus notices and announcements
- Library books and resources (always check availability)
- Faculty contact information
- Campus services and locations (including canteen timings and hours)

Guidelines:
- Be helpful, friendly, and concise.
- When you have database context below, use it to give accurate, specific answers.
- If asked about "today's classes" or "my timetable", refer to ${currentDay}'s classes from the schedule.
- If asked about a specific subject (e.g. DBMS, Data Structures, AI), find all days, times, and room locations for it.

- CRITICAL FOR BOOK & LIBRARY QUERIES:
  1. ALWAYS check the campus library database records provided below to verify if books requested or recommended are currently available in the university library.
  2. For every book mentioned or suggested, ALWAYS explicitly state its live availability status in the library:
     - If available: "Available in Central Library (Ready to borrow)"
     - If borrowed/checked out: "Currently Borrowed / Checked Out (Expected return date: <return_date>)"
     - If recommending standard external textbooks not currently in the campus catalog: explicitly note "(Not currently in campus library catalog)".
  3. NEVER ask the student "Would you like me to check if any of these are available in the university library?" — you MUST proactively check and state their availability immediately in your answer!

- CRITICAL FOR CANTEEN & CAMPUS SERVICES QUERIES:
  1. When asked about canteen timing, hours, food, or location:
     - State clearly that the Campus Canteen is open from 08:30 AM to 06:30 PM, Monday through Saturday (Closed on Sundays).
     - State that it is located on the Ground Floor of the Student Center.
     - Mention subsidized student meals, breakfast & lunch combos, tea/coffee snacks, and quick counter token pickup (Counter 2).
  2. For other campus services (Bus, Library, IT Support, Health Clinic, Security), provide their exact official timings and locations from the context.

- Always mention the source of your information when available.
- Keep responses under 200 words unless the user asks for details.
- Use markdown formatting for lists and emphasis when helpful.
- CRITICAL FORMATTING: Whenever providing numbered lists (1., 2.) or bullet points (*, -), ALWAYS place every item on its own new line. Never write list items continuously on a single line.
${
  language && language !== "English"
    ? `
- CRITICAL LANGUAGE INSTRUCTION:
  The student's selected language preference in settings is "${language}".
  You MUST write your entire reply in ${language} (${
        language === "Hindi"
          ? "हिंदी using Devanagari script"
          : language === "Gujarati"
          ? "ગુજરાતી using Gujarati script"
          : language
      }).
  If the student asks whether you support or get affected by their Hindi/Gujarati/language setting, confirm enthusiastically in ${language} that you do support it and that you are happily conversing in ${language}!
  Ensure all greetings, timetable breakdowns, notices, and advice are naturally written in ${language}. Keep standard room numbers (e.g. Room 302) or subject codes (e.g. DBMS, OS) clear.
`
    : ""
}
${dbContext}`

    // ── Build the messages array with conversation history ──
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role === "ai" ? "assistant" : msg.role,
        content: msg.content,
      })),
      { role: "user", content: question },
    ]

    // ── Call OpenRouter API with concrete active chat models ──
    const candidateModels = [
      "inclusionai/ling-3.0-flash-sante:free",
      "poolside/laguna-xs-2.1:free",
      "poolside/laguna-s-2.1:free",
      "qwen/qwen3.8-27b:free",
      "google/gemma-4-26b-a4b-it:free",
      "openrouter/free",
    ]

    const isSafetyOrGarbage = (text: string) => {
      const trimmed = text.trim().toLowerCase()
      return (
        trimmed.startsWith("user safety:") ||
        trimmed === "safe" ||
        trimmed === "unsafe" ||
        trimmed.includes("currently unreachable") ||
        /^error:/i.test(trimmed)
      )
    }

    let openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": supabaseUrl,
          "X-Title": "Campus Copilot",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          models: candidateModels,
          messages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      }
    )

    let completion: any = null
    let aiText = ""

    if (openRouterResponse.ok) {
      completion = await openRouterResponse.json()
      aiText = completion.choices?.[0]?.message?.content || completion.choices?.[0]?.message?.reasoning || ""
    }

    // If OpenRouter returned unreachable, failed, or a safety-check leak like "User Safety: safe"
    const isUnreachable =
      !openRouterResponse.ok ||
      !aiText ||
      completion?.error ||
      isSafetyOrGarbage(aiText)

    if (isUnreachable) {
      console.warn("Primary model unreachable or returned invalid safety output. Attempting backup model qwen/qwen3.8-27b:free...")
      const backupResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": supabaseUrl,
            "X-Title": "Campus Copilot",
          },
          body: JSON.stringify({
            model: "qwen/qwen3.8-27b:free",
            messages,
            max_tokens: 1024,
            temperature: 0.7,
          }),
        }
      )

      if (backupResponse.ok) {
        const backupCompletion = await backupResponse.json()
        const candidateText = backupCompletion.choices?.[0]?.message?.content || backupCompletion.choices?.[0]?.message?.reasoning
        if (candidateText && !isSafetyOrGarbage(candidateText)) {
          aiText = candidateText
          completion = backupCompletion
        }
      }
    }

    // If still empty or unreachable or safety output, construct response from database context
    if (!aiText || isSafetyOrGarbage(aiText)) {
      if (dbContext.trim()) {
        aiText = `Here is the official information from campus records:\n\n${dbContext.trim()}`
      } else {
        return new Response(
          JSON.stringify({ error: "Campus AI model is temporarily unreachable. Please try again." }),
          {
            status: 502,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
          }
        )
      }
    }

    return new Response(
      JSON.stringify({
        text: aiText,
        source,
        model: completion?.model || "campus-copilot-model",
        usage: completion?.usage || null,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Edge function error:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    )
  }
})
