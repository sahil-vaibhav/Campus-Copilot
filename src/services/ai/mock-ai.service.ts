import type { AiService, CampusAnswer, CampusIntent } from "./types"
import { facultyMock, libraryBooksMock, noticesMock, timetableMock } from "../../data/mock"

export function detectIntent(query: string): CampusIntent {
  const text = query.toLowerCase()

  // 1. Library check (must precede timetable so "books for subject Database" goes to library)
  if (/book|books|library|borrow|author|textbook|textbooks|shelf|catalog|catalogue|read|reading|किताब|पुस्तक|लाइब्रेरी|પુસ્તક|વાંચન|લાઇબ્રેરી/.test(text)) {
    return "library"
  }

  // 2. Campus services & amenities (canteen, transport, IT support, medical, timings)
  if (/canteen|cafeteria|food|meal|meals|lunch|breakfast|snack|timing|timings|working hour|working hours|transport|bus|buses|route|wifi|wi-fi|it support|medical|clinic|doctor|security|student affairs|service|services|કેન્ટીન|બસ|દાક્તર|कैंटीन|भोजनालय|बस|डॉक्टर|चिकित्सा/.test(text)) {
    return "services"
  }

  // 3. Faculty directory (checked before timetable so "Who teaches Operating Systems?" routes to faculty)
  if (/faculty|professor|teacher|teaches|instructor|office|dean|hod|who teaches|प्रोफेसर|शिक्षक|અધ્યાપક/.test(text)) {
    return "faculty"
  }

  // 4. Timetable / class schedule
  if (/timetable|class|classes|schedule|lecture|lectures|lab|labs|dbms|operating system|data structure|network|artificial intelligence|subject|period|टाइमटेबल|क्लास|कक्षा|शेड्यूल|લેક્ચર|સમયપત્રક/.test(text)) {
    return "timetable"
  }

  // 5. Notices & announcements
  if (/notice|notices|announcement|exam|holiday|circular|सूचना|नोटिस|परीक्षा|સૂચના|નોટિસ|પરીક્ષા/.test(text)) {
    return "notices"
  }

  // 6. Campus locations
  if (/where|location|room|block|building|department|floor|कहाँ|स्थान|ક્યાં/.test(text)) {
    return "location"
  }

  return "general"
}

function getBooksResponse(query: string, lang: string): CampusAnswer {
  const text = query.toLowerCase()
  let matched = libraryBooksMock.filter((b) => {
    if (text.includes("database") || text.includes("dbms")) {
      return /database|sql/i.test(b.title) || /database/i.test(b.category)
    }
    if (text.includes("ai") || text.includes("artificial intelligence") || text.includes("machine learning") || text.includes("deep learning")) {
      return /intelligence|learning/i.test(b.title) || /intelligence/i.test(b.category)
    }
    if (text.includes("network") || text.includes("networking")) {
      return /network/i.test(b.title) || /network/i.test(b.category)
    }
    if (text.includes("operating system") || text.includes("os")) {
      return /operating system/i.test(b.title)
    }
    if (text.includes("algorithm") || text.includes("data structure")) {
      return /algorithm|structure/i.test(b.title)
    }
    if (text.includes("software") || text.includes("clean code") || text.includes("design pattern") || text.includes("typescript")) {
      return /code|pattern|refactoring|typescript|pragmatic|software/i.test(b.title) || /software/i.test(b.category)
    }
    return false
  })

  if (matched.length === 0) {
    matched = libraryBooksMock.slice(0, 3)
  }

  if (lang === "Hindi") {
    const list = matched
      .map(
        (b) =>
          `• “${b.title}” (लेखक: ${b.author}) — ${
            b.available
              ? "सेंट्रल लाइब्रेरी में उपलब्ध है (इश्यू करने के लिए तैयार)"
              : `वर्तमान में इश्यू है (वापसी की तारीख: ${b.returnDate || "शीघ्र"})`
          }`
      )
      .join("\n")
    return {
      text: `यहाँ लाइब्रेरी कैटलॉग से पुस्तकें और उनकी लाइव उपलब्धता स्थिति है:\n\n${list}\n\nलाइब्रेरी समय: सोम – शनि सुबह 08:00 से रात 08:00 बजे तक (लाइब्रेरी ब्लॉक)।`,
      source: "सेंट्रल लाइब्रेरी कैटलॉग",
    }
  }

  if (lang === "Gujarati") {
    const list = matched
      .map(
        (b) =>
          `• “${b.title}” (લેખક: ${b.author}) — ${
            b.available
              ? "સેન્ટ્રલ લાઇબ્રેરીમાં ઉપલબ્ધ છે (ઇશ્યૂ માટે તૈયાર)"
              : `હાલમાં ઇશ્યૂ થયેલ છે (પરત તારીખ: ${b.returnDate || "ટૂંક સમયમાં"})`
          }`
      )
      .join("\n")
    return {
      text: `અહીં પુસ્તકાલયમાંથી પુસ્તકો અને તેમની લાઇવ ઉપલબ્ધતા સ્થિતિ છે:\n\n${list}\n\nલાઇબ્રેરી સમય: સોમ – શનિ સવારે 08:00 થી રાત્રે 08:00 સુધી (લાઇબ્રેરી બ્લોક).`,
      source: "સેન્ટ્રલ લાઇબ્રેરી કેટલોગ",
    }
  }

  // English
  const list = matched
    .map(
      (b) =>
        `• **"${b.title}"** by ${b.author} [${b.category}]\n  - Library Status: ${
          b.available
            ? "✅ Available in Central Library (Ready for checkout)"
            : `❌ Currently Checked Out / Borrowed (Expected return: ${b.returnDate || "Soon"})`
        }`
    )
    .join("\n")

  return {
    text: `Here are relevant books from the campus library database with their live availability status:\n\n${list}\n\nCentral Library hours: Mon – Sat, 08:00 AM – 08:00 PM (Library Block, Ground & 1st Floor).`,
    source: "Central Library · Live Catalog",
  }
}

function getServicesResponse(query: string, lang: string): CampusAnswer {
  const text = query.toLowerCase()
  const isCanteen = /canteen|cafeteria|food|meal|lunch|breakfast|snack|કેન્ટીન|भोजनालय|कैंटीन/.test(text)

  if (lang === "Hindi") {
    if (isCanteen) {
      return {
        text: "कैंपस कैंटीन का समय सोमवार से शनिवार सुबह 08:30 बजे से शाम 06:30 बजे तक है (रविवार को बंद)। यह स्टूडेंट सेंटर के ग्राउंड फ्लोर पर स्थित है। यहाँ रियायती भोजन, नाश्ता और प्री-ऑर्डर मील टोकन (काउंटर 2) उपलब्ध है।",
        source: "कैंपस सर्विसेज · कैंटीन",
      }
    }
    return {
      text: "कैंपस सर्विसेज: कैंटीन (08:30 AM – 06:30 PM, स्टूडेंट सेंटर), लाइब्रेरी (08:00 AM – 08:00 PM), बस ट्रांसपोर्ट (07:30 AM – 06:00 PM), IT सपोर्ट (09:00 AM – 06:00 PM), मेडिकल क्लिनिक (24/7 ER, डॉक्टर 09:00 AM – 05:00 PM), सिक्योरिटी (24/7)।",
      source: "कैंपस सर्विसेज & टाइमिंग",
    }
  }

  if (lang === "Gujarati") {
    if (isCanteen) {
      return {
        text: "કેમ્પસ કેન્ટીનનો સમય સોમવારથી શનિવાર સવારે 08:30 થી સાંજે 06:30 સુધીનો છે (રવિવારે બંધ). તે સ્ટુડન્ટ સેન્ટરના ગ્રાઉન્ડ ફ્લોર પર આવેલ છે.",
        source: "કેમ્પસ સેવાઓ · કેન્ટીન",
      }
    }
    return {
      text: "કેમ્પસ સેવાઓ: કેન્ટીન (08:30 AM – 06:30 PM), લાઇબ્રેરી (08:00 AM – 08:00 PM), બસ સેવા (07:30 AM – 06:00 PM), IT સપોર્ટ (09:00 AM – 06:00 PM), હેલ્થ સેન્ટર (24/7 ER).",
      source: "કેમ્પસ સેવાઓ & સમય",
    }
  }

  // English
  if (isCanteen) {
    return {
      text: "The Campus Canteen is open from **08:30 AM to 06:30 PM**, **Monday through Saturday** (Closed on Sundays).\n\n• **Location**: Student Center, Ground Floor\n• **Contact**: canteen@silveroak.edu\n• **Highlights**: Hygienic subsidized student meals, healthy breakfast combos, hot lunch, snacks & tea/coffee, and quick counter pickup tokens (Counter 2).",
      source: "Campus Services · Canteen",
    }
  }

  return {
    text: "Official Silver Oak Campus Services & Timings:\n- **Campus Canteen**: 08:30 AM – 06:30 PM (Mon – Sat, Student Center Ground Floor)\n- **Central Library**: 08:00 AM – 08:00 PM (Mon – Sat, Library Block Ground & 1st Floor)\n- **Campus Bus Transit**: 07:30 AM – 06:00 PM (Mon – Sat, Main Gate Bus Terminal)\n- **IT Support Desk**: 09:00 AM – 06:00 PM (Mon – Sat, Student Center 2nd Floor)\n- **Health Center / Clinic**: 24/7 Emergency & Ambulance; Doctor Consultation Mon – Sat: 09:00 AM – 05:00 PM (Block A, Room 102)\n- **Campus Security**: 24/7 Active (Gate 1 & Gate 2)",
    source: "Campus Services & Timings",
  }
}

export const mockAiService: AiService = {
  async ask(
    question: string,
    _history: { role: string; content: string }[] = [],
    _userName?: string,
    language?: string
  ): Promise<CampusAnswer> {
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    const intent = detectIntent(question)
    const lang = language || (typeof localStorage !== "undefined" ? localStorage.getItem("campus-copilot-language") || "English" : "English")

    if (lang === "Hindi") {
      if (intent === "library") {
        return getBooksResponse(question, lang)
      }
      if (intent === "services") {
        return getServicesResponse(question, lang)
      }
      if (intent === "timetable") {
        const todaysClasses = timetableMock.filter((item) => item.day === "Monday")
        const next = todaysClasses[0]!
        return {
          text: `आपकी अगली क्लास ${next.subject} सुबह ${next.time} बजे ${next.room} में है। आज आपकी ${todaysClasses.length - 1} और क्लासेस हैं।`,
          source: "टाइमटेबल · आज का शेड्यूल",
        }
      }
      if (intent === "notices") {
        const notice = noticesMock.find((item) => item.isImportant) ?? noticesMock[0]
        return {
          text: `कैंपस के ${noticesMock.length} नए नोटिस उपलब्ध हैं। सबसे महत्वपूर्ण नोटिस है: “${notice.title}”।`,
          source: "कैंपस नोटिस · आज अपडेट किया गया",
        }
      }
      if (intent === "faculty") {
        const member = facultyMock.find((item) => /operating systems/i.test(item.subject)) ?? facultyMock[0]
        return {
          text: `${member.name} ${member.subject} पढ़ाते हैं। आप उन्हें ${member.office} में मिल सकते हैं या ${member.email} पर ईमेल कर सकते हैं।`,
          source: "फैकल्टी डायरेक्टरी",
        }
      }
      if (intent === "location") {
        return {
          text: "कंप्यूटर साइंस एंड इंजीनियरिंग डिपार्टमेंट ब्लॉक A की चौथी मंजिल पर है। अन्य सुविधाओं के लिए कैंपस सर्विसेज देखें।",
          source: "कैंपस डायरेक्टरी",
        }
      }
      return {
        text: "हाँ, मैं सेटिंग्स में चुनी गई हिंदी भाषा के अनुसार उत्तर देता हूँ। मैं आपके टाइमटेबल, नोटिस, लाइब्रेरी बुक्स और फैकल्टी संपर्कों में सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?",
        source: "कैंपस कोपायलट",
      }
    }

    if (lang === "Gujarati") {
      if (intent === "library") {
        return getBooksResponse(question, lang)
      }
      if (intent === "services") {
        return getServicesResponse(question, lang)
      }
      if (intent === "timetable") {
        const todaysClasses = timetableMock.filter((item) => item.day === "Monday")
        const next = todaysClasses[0]!
        return {
          text: `તમારો આગલો વર્ગ ${next.subject} સવારે ${next.time} વાગ્યે ${next.room} માં છે. આજે તમારા બીજા ${todaysClasses.length - 1} વર્ગો પણ છે.`,
          source: "સમયપત્રક · આજનું શેડ્યૂલ",
        }
      }
      if (intent === "notices") {
        const notice = noticesMock.find((item) => item.isImportant) ?? noticesMock[0]
        return {
          text: `કેમ્પસની ${noticesMock.length} તાજી નોટિસો ઉપલબ્ધ છે. સૌથી મહત્વપૂર્ણ નોટિસ છે: “${notice.title}”.`,
          source: "કેમ્પસ નોટિસ · અપડેટ થયેલ",
        }
      }
      return {
        text: "હા, હું સેટિંગ્સમાં પસંદ કરેલી ગુજરાતી ભાષામાં સંપૂર્ણ સહાય કરું છું. સમયપત્રક, નોટિસ કે પુસ્તકો વિશે પૂછી શકો છો.",
        source: "કેમ્પસ કોપાયલટ",
      }
    }

    // Default English
    if (intent === "library") {
      return getBooksResponse(question, "English")
    }
    if (intent === "services") {
      return getServicesResponse(question, "English")
    }
    if (intent === "timetable") {
      const todaysClasses = timetableMock.filter((item) => item.day === "Monday")
      const next = todaysClasses[0]!
      return { text: `Your next class is ${next.subject} at ${next.time} in ${next.room}. You also have ${todaysClasses.length - 1} more classes today.`, source: "Timetable · Updated today" }
    }
    if (intent === "notices") {
      const notice = noticesMock.find((item) => item.isImportant) ?? noticesMock[0]
      return { text: `There are ${noticesMock.length} recent campus notices. The latest important update is “${notice.title}”.`, source: "Campus notices · Updated today" }
    }
    if (intent === "faculty") {
      const member = facultyMock.find((item) => /operating systems/i.test(item.subject)) ?? facultyMock[0]
      return { text: `${member.name} teaches ${member.subject}. You can find them at ${member.office} or email ${member.email}.`, source: "Faculty directory" }
    }
    if (intent === "location") return { text: "The Computer Science & Engineering department is in Block A, 4th floor. Campus Services has details for other facilities.", source: "Campus directory" }
    return { text: "I can help you find timetable details, campus notices, library books, faculty contacts, and campus locations. What would you like to know?", source: "Campus Copilot" }
  },
}
