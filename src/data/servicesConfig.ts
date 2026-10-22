import React from "react"
import { servicesMock } from "./mock"
import {
  BookOpen,
  Coffee,
  Bus,
  Laptop,
  HeartPulse,
  ShieldCheck,
  Users,
  PartyPopper,
} from "lucide-react"

export type ServiceItem = (typeof servicesMock)[number]

export interface ServiceSchedule {
  startHour?: number
  startMinute?: number
  endHour?: number
  endMinute?: number
  daysOpen?: number[] // 0=Sun, 1=Mon, ..., 6=Sat
  is24x7?: boolean
  doctorHours?: { startHour: number; startMinute: number; endHour: number; endMinute: number }
  openBadge: string
  closedBadge?: string
  daysDescription: string
  startVerb?: string
  closeVerb?: string
}

export interface ServiceMetaConfig {
  icon: React.ComponentType<{ className?: string }>
  timing: string
  location: string
  contact: string
  highlights: string[]
  actionLabel: string
  schedule: ServiceSchedule
}

export function formatTime12(hours: number, minutes: number): string {
  const period = hours >= 12 ? "PM" : "AM"
  const h = hours % 12 === 0 ? 12 : hours % 12
  const m = minutes.toString().padStart(2, "0")
  return `${h.toString().padStart(2, "0")}:${m} ${period}`
}

export interface ServiceStatusResult {
  isOpen: boolean
  statusType: "open" | "closed" | "partial"
  badge: string
  timingSummary: string
  banner: string
}

export function computeServiceStatus(
  schedule: ServiceSchedule,
  date: Date = new Date()
): ServiceStatusResult {
  const day = date.getDay()
  const currentMinutes = date.getHours() * 60 + date.getMinutes()
  const startVerb = schedule.startVerb || "Opens at"
  const closeVerb = schedule.closeVerb || "Closes at"

  // 1. Medical: 24/7 Emergency + Doctor Consultation Hours
  if (schedule.doctorHours) {
    const isDocDay = !schedule.daysOpen || schedule.daysOpen.includes(day)
    const docStart = schedule.doctorHours.startHour * 60 + schedule.doctorHours.startMinute
    const docEnd = schedule.doctorHours.endHour * 60 + schedule.doctorHours.endMinute
    const isDocPresent = isDocDay && currentMinutes >= docStart && currentMinutes < docEnd

    const docStartStr = formatTime12(schedule.doctorHours.startHour, schedule.doctorHours.startMinute)
    const docEndStr = formatTime12(schedule.doctorHours.endHour, schedule.doctorHours.endMinute)

    if (isDocPresent) {
      return {
        isOpen: true,
        statusType: "open",
        badge: schedule.openBadge,
        timingSummary: `Doctor until ${docEndStr}`,
        banner: `Doctor is currently on campus until ${docEndStr}. 24/7 emergency clinic and campus ambulance are fully active.`,
      }
    } else {
      const nextDayDoc = day === 6 ? "Monday" : "tomorrow"
      const docTimingStr =
        isDocDay && currentMinutes < docStart
          ? `Doctor arrives today at ${docStartStr}`
          : `Doctor arrives ${nextDayDoc} at ${docStartStr}`

      return {
        isOpen: true, // Emergency desk is 24/7 active
        statusType: "partial",
        badge: schedule.closedBadge || "Emergency Only",
        timingSummary: `Doctor at ${docStartStr} · 24/7 ER`,
        banner: `Doctor consultation is off-duty (${docTimingStr}). Emergency desk, first aid, and ambulance services remain active 24/7.`,
      }
    }
  }

  // 2. Pure 24/7 Operations (Security, Online Clubs Portal)
  if (schedule.is24x7) {
    return {
      isOpen: true,
      statusType: "open",
      badge: schedule.openBadge,
      timingSummary: schedule.openBadge === "24x7 Active" ? "24 Hours Active" : "Ongoing Activities",
      banner: `${schedule.openBadge} · Operational 24 hours a day, 7 days a week.`,
    }
  }

  // 3. Regular Timed Campus Services
  const isDayOpen = !schedule.daysOpen || schedule.daysOpen.includes(day)
  const startM = (schedule.startHour ?? 0) * 60 + (schedule.startMinute ?? 0)
  const endM = (schedule.endHour ?? 24) * 60 + (schedule.endMinute ?? 0)
  const startTimeStr = formatTime12(schedule.startHour ?? 0, schedule.startMinute ?? 0)
  const endTimeStr = formatTime12(schedule.endHour ?? 0, schedule.endMinute ?? 0)

  const baseVerb = startVerb.replace(/\s+at$/i, "")

  if (!isDayOpen) {
    return {
      isOpen: false,
      statusType: "closed",
      badge: schedule.closedBadge || "Closed",
      timingSummary: `${baseVerb} Monday at ${startTimeStr}`,
      banner: `Currently Closed (Closed on Sundays) · ${baseVerb} Monday at ${startTimeStr}.`,
    }
  }

  if (currentMinutes < startM) {
    return {
      isOpen: false,
      statusType: "closed",
      badge: schedule.closedBadge || "Closed",
      timingSummary: `${startVerb} ${startTimeStr}`,
      banner: `Currently Closed · ${startVerb} today at ${startTimeStr} (Open until ${endTimeStr}).`,
    }
  }

  if (currentMinutes >= endM) {
    const nextDayStr = day === 6 ? "Monday" : "tomorrow"
    return {
      isOpen: false,
      statusType: "closed",
      badge: schedule.closedBadge || "Closed",
      timingSummary: `${baseVerb} ${nextDayStr} at ${startTimeStr}`,
      banner: `Currently Closed · Closed for the day at ${endTimeStr}. ${baseVerb} ${nextDayStr} at ${startTimeStr}.`,
    }
  }

  return {
    isOpen: true,
    statusType: "open",
    badge: schedule.openBadge,
    timingSummary: `${closeVerb} ${endTimeStr}`,
    banner: `Currently Open · Operating today until ${endTimeStr}.`,
  }
}

export const SERVICE_META: Record<number, ServiceMetaConfig> = {
  1: {
    icon: BookOpen,
    timing: "08:00 AM – 08:00 PM",
    location: "Library Block, Ground & 1st Floor",
    contact: "library@silveroak.edu",
    schedule: {
      startHour: 8,
      startMinute: 0,
      endHour: 20,
      endMinute: 0,
      daysOpen: [1, 2, 3, 4, 5, 6],
      daysDescription: "Mon – Sat: 08:00 AM – 08:00 PM",
      openBadge: "Open Now",
      closedBadge: "Closed",
      startVerb: "Opens at",
      closeVerb: "Closes at",
    },
    highlights: ["Over 25,000 physical textbooks", "IEEE, Springer & ACM digital access", "Quiet individual & group study zones"],
    actionLabel: "Open Library Catalog",
  },
  2: {
    icon: Coffee,
    timing: "08:30 AM – 06:30 PM",
    location: "Student Center, Ground Floor",
    contact: "canteen@silveroak.edu",
    schedule: {
      startHour: 8,
      startMinute: 30,
      endHour: 18,
      endMinute: 30,
      daysOpen: [1, 2, 3, 4, 5, 6],
      daysDescription: "Mon – Sat: 08:30 AM – 06:30 PM",
      openBadge: "Open Now",
      closedBadge: "Closed",
      startVerb: "Opens at",
      closeVerb: "Closes at",
    },
    highlights: ["Healthy breakfast, lunch combos & snacks", "Quick counter pickup token system", "Hygienic subsidized student meals"],
    actionLabel: "Pre-Order Meal Token",
  },
  3: {
    icon: Bus,
    timing: "07:30 AM – 06:00 PM",
    location: "Main Campus Gate Bus Terminal",
    contact: "+91 79 6604 7010",
    schedule: {
      startHour: 7,
      startMinute: 30,
      endHour: 18,
      endMinute: 0,
      daysOpen: [1, 2, 3, 4, 5, 6],
      daysDescription: "Mon – Sat: 07:30 AM – 06:00 PM",
      openBadge: "Routes Active",
      closedBadge: "Closed",
      startVerb: "Starts at",
      closeVerb: "Active until",
    },
    highlights: ["5 city routes covering Gandhinagar & Ahmedabad", "Live GPS tracking on all buses", "Quarterly & semester student transit pass"],
    actionLabel: "Track Live Bus Location",
  },
  4: {
    icon: Laptop,
    timing: "09:00 AM – 06:00 PM",
    location: "Student Center 2nd Floor & IT Lab 1",
    contact: "it-support@silveroak.edu",
    schedule: {
      startHour: 9,
      startMinute: 0,
      endHour: 18,
      endMinute: 0,
      daysOpen: [1, 2, 3, 4, 5, 6],
      daysDescription: "Mon – Sat: 09:00 AM – 06:00 PM",
      openBadge: "Desk Online",
      closedBadge: "Closed",
      startVerb: "Opens at",
      closeVerb: "Closes at",
    },
    highlights: ["Campus High-Speed Wi-Fi login assistance", "Student ERP & portal password resets", "Software licenses & lab workstation support"],
    actionLabel: "Submit IT Support Ticket",
  },
  5: {
    icon: HeartPulse,
    timing: "24/7 Emergency · Doctor 09:00 AM – 05:00 PM",
    location: "Health Center, Block A (Room 102)",
    contact: "+91 79 108 0000",
    schedule: {
      is24x7: true,
      doctorHours: { startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
      daysOpen: [1, 2, 3, 4, 5, 6],
      daysDescription: "24/7 Emergency · Doctor Mon – Sat: 09:00 AM – 05:00 PM",
      openBadge: "Doctor On Campus",
      closedBadge: "Emergency Only",
    },
    highlights: ["Free general consultation & first aid", "Essential OTC medical supplies", "Dedicated campus emergency ambulance"],
    actionLabel: "Call Medical Emergency Desk",
  },
  6: {
    icon: ShieldCheck,
    timing: "24/7 Campus Control Room",
    location: "Security Office, Gate 1 & Gate 2",
    contact: "+91 79 6604 7000",
    schedule: {
      is24x7: true,
      daysDescription: "24 Hours / 7 Days a week",
      openBadge: "24x7 Active",
      closedBadge: "24x7 Active",
    },
    highlights: ["Lost & Found registry counter", "Campus entry clearance & parking surveillance", "Emergency campus safety helpline"],
    actionLabel: "Report Lost & Found Item",
  },
  7: {
    icon: Users,
    timing: "10:00 AM – 04:30 PM",
    location: "Academic Block A, Room 104",
    contact: "studentaffairs@silveroak.edu",
    schedule: {
      startHour: 10,
      startMinute: 0,
      endHour: 16,
      endMinute: 30,
      daysOpen: [1, 2, 3, 4, 5, 6],
      daysDescription: "Mon – Sat: 10:00 AM – 04:30 PM",
      openBadge: "Open for Queries",
      closedBadge: "Closed",
      startVerb: "Opens at",
      closeVerb: "Closes at",
    },
    highlights: ["Bonafide certificates & verification letters", "Scholarship & fee concession guidance", "Student council & grievance support"],
    actionLabel: "Request Bonafide Certificate",
  },
  8: {
    icon: PartyPopper,
    timing: "Ongoing Activities · Online 24/7",
    location: "Student Activity Center & Amphitheater",
    contact: "clubs@silveroak.edu",
    schedule: {
      is24x7: true,
      daysDescription: "Online Registrations 24/7",
      openBadge: "Registrations Open",
      closedBadge: "Registrations Open",
    },
    highlights: ["GDSC, Robotics & AI, Coding Clubs", "Cultural, Dance, Drama & Music societies", "Annual Tech Fest 2026 participation"],
    actionLabel: "Register for Club / Event",
  },
}
