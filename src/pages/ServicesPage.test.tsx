import { describe, expect, it } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ServicesPage from "./ServicesPage"
import { computeServiceStatus, SERVICE_META } from "../data/servicesConfig"

describe("Campus Services Operating Hours & Status Precision", () => {
  // Helper to create a specific Date (2026-09-28 is a Monday)
  const createTestDate = (hour: number, minute: number, dayOfWeek = 1) => {
    // 2026-09-28 is Monday (dayOfWeek = 1)
    // 2026-10-04 is Sunday (dayOfWeek = 0)
    const baseDay = dayOfWeek === 0 ? 4 : 27 + dayOfWeek
    const month = dayOfWeek === 0 ? 9 : 8 // 0-indexed: 8=Sep, 9=Oct
    const date = new Date(2026, month, baseDay, hour, minute, 0, 0)
    return date
  }

  it("accurately reports services as closed at 04:30 AM", () => {
    const earlyMorning = createTestDate(4, 30, 1) // Mon 4:30 AM

    // Library: 08:00 AM – 08:00 PM
    const libraryStatus = computeServiceStatus(SERVICE_META[1]!.schedule, earlyMorning)
    expect(libraryStatus.isOpen).toBe(false)
    expect(libraryStatus.statusType).toBe("closed")
    expect(libraryStatus.badge).toBe("Closed")
    expect(libraryStatus.timingSummary).toBe("Opens at 08:00 AM")

    // Canteen: 08:30 AM – 06:30 PM
    const canteenStatus = computeServiceStatus(SERVICE_META[2]!.schedule, earlyMorning)
    expect(canteenStatus.isOpen).toBe(false)
    expect(canteenStatus.statusType).toBe("closed")
    expect(canteenStatus.badge).toBe("Closed")
    expect(canteenStatus.timingSummary).toBe("Opens at 08:30 AM")

    // Transport: 07:30 AM – 06:00 PM
    const transportStatus = computeServiceStatus(SERVICE_META[3]!.schedule, earlyMorning)
    expect(transportStatus.isOpen).toBe(false)
    expect(transportStatus.statusType).toBe("closed")
    expect(transportStatus.badge).toBe("Closed")
    expect(transportStatus.timingSummary).toBe("Starts at 07:30 AM")

    // IT Support: 09:00 AM – 06:00 PM
    const itStatus = computeServiceStatus(SERVICE_META[4]!.schedule, earlyMorning)
    expect(itStatus.isOpen).toBe(false)
    expect(itStatus.statusType).toBe("closed")
    expect(itStatus.badge).toBe("Closed")
    expect(itStatus.timingSummary).toBe("Opens at 09:00 AM")

    // Student Affairs: 10:00 AM – 04:30 PM
    const saStatus = computeServiceStatus(SERVICE_META[7]!.schedule, earlyMorning)
    expect(saStatus.isOpen).toBe(false)
    expect(saStatus.statusType).toBe("closed")
    expect(saStatus.badge).toBe("Closed")
    expect(saStatus.timingSummary).toBe("Opens at 10:00 AM")

    // Medical: 24/7 ER, doctor arrives 09:00 AM
    const medicalStatus = computeServiceStatus(SERVICE_META[5]!.schedule, earlyMorning)
    expect(medicalStatus.statusType).toBe("partial")
    expect(medicalStatus.badge).toBe("Emergency Only")
    expect(medicalStatus.timingSummary).toContain("09:00 AM")

    // Security: 24x7 Active
    const securityStatus = computeServiceStatus(SERVICE_META[6]!.schedule, earlyMorning)
    expect(securityStatus.isOpen).toBe(true)
    expect(securityStatus.statusType).toBe("open")
    expect(securityStatus.badge).toBe("24x7 Active")

    // Clubs & Events: Registrations Open
    const clubsStatus = computeServiceStatus(SERVICE_META[8]!.schedule, earlyMorning)
    expect(clubsStatus.isOpen).toBe(true)
    expect(clubsStatus.badge).toBe("Registrations Open")
  })

  it("accurately reports services as open during midday operations (11:30 AM)", () => {
    const midday = createTestDate(11, 30, 1) // Mon 11:30 AM

    const libraryStatus = computeServiceStatus(SERVICE_META[1]!.schedule, midday)
    expect(libraryStatus.isOpen).toBe(true)
    expect(libraryStatus.statusType).toBe("open")
    expect(libraryStatus.badge).toBe("Open Now")
    expect(libraryStatus.timingSummary).toBe("Closes at 08:00 PM")

    const canteenStatus = computeServiceStatus(SERVICE_META[2]!.schedule, midday)
    expect(canteenStatus.isOpen).toBe(true)
    expect(canteenStatus.badge).toBe("Open Now")
    expect(canteenStatus.timingSummary).toBe("Closes at 06:30 PM")

    const transportStatus = computeServiceStatus(SERVICE_META[3]!.schedule, midday)
    expect(transportStatus.isOpen).toBe(true)
    expect(transportStatus.badge).toBe("Routes Active")
    expect(transportStatus.timingSummary).toBe("Active until 06:00 PM")

    const itStatus = computeServiceStatus(SERVICE_META[4]!.schedule, midday)
    expect(itStatus.isOpen).toBe(true)
    expect(itStatus.badge).toBe("Desk Online")
    expect(itStatus.timingSummary).toBe("Closes at 06:00 PM")

    const medicalStatus = computeServiceStatus(SERVICE_META[5]!.schedule, midday)
    expect(medicalStatus.isOpen).toBe(true)
    expect(medicalStatus.statusType).toBe("open")
    expect(medicalStatus.badge).toBe("Doctor On Campus")
    expect(medicalStatus.timingSummary).toBe("Doctor until 05:00 PM")

    const saStatus = computeServiceStatus(SERVICE_META[7]!.schedule, midday)
    expect(saStatus.isOpen).toBe(true)
    expect(saStatus.badge).toBe("Open for Queries")
    expect(saStatus.timingSummary).toBe("Closes at 04:30 PM")
  })

  it("accurately handles closing edge cases at 04:30 PM and evening", () => {
    const evening430 = createTestDate(16, 30, 1) // Mon 4:30 PM
    const saStatus = computeServiceStatus(SERVICE_META[7]!.schedule, evening430)
    expect(saStatus.isOpen).toBe(false)
    expect(saStatus.badge).toBe("Closed")
    expect(saStatus.timingSummary).toContain("Opens tomorrow at 10:00 AM")

    // But Library is still open at 4:30 PM
    const libraryStatus = computeServiceStatus(SERVICE_META[1]!.schedule, evening430)
    expect(libraryStatus.isOpen).toBe(true)

    // At 9:00 PM, Library is closed
    const night900 = createTestDate(21, 0, 1)
    const libraryNight = computeServiceStatus(SERVICE_META[1]!.schedule, night900)
    expect(libraryNight.isOpen).toBe(false)
    expect(libraryNight.badge).toBe("Closed")
    expect(libraryNight.timingSummary).toContain("Opens tomorrow at 08:00 AM")
  })

  it("handles Sunday closures gracefully while keeping 24x7 safety active", () => {
    const sundayAfternoon = createTestDate(14, 0, 0) // Sun 2:00 PM

    const libraryStatus = computeServiceStatus(SERVICE_META[1]!.schedule, sundayAfternoon)
    expect(libraryStatus.isOpen).toBe(false)
    expect(libraryStatus.timingSummary).toBe("Opens Monday at 08:00 AM")

    const securityStatus = computeServiceStatus(SERVICE_META[6]!.schedule, sundayAfternoon)
    expect(securityStatus.isOpen).toBe(true)
    expect(securityStatus.badge).toBe("24x7 Active")
  })
})

describe("ServicesPage UI Component Rendering", () => {
  it("renders ServicesPage at 04:30 AM with accurate Closed badges and interactive modal", () => {
    // Mon Sep 28 2026 04:30:00
    const mockDate = new Date(2026, 8, 28, 4, 30, 0, 0)

    render(<ServicesPage initialTime={mockDate} />)

    // Verify Campus Time is rendered in the header
    expect(screen.getByText(/Campus Time:/i)).toBeInTheDocument()

    // At 4:30 AM, multiple services must display "Closed"
    const closedBadges = screen.getAllByText("Closed")
    expect(closedBadges.length).toBeGreaterThanOrEqual(4)

    // Check specific services
    expect(screen.getByText("Opens at 08:00 AM")).toBeInTheDocument() // Library
    expect(screen.getByText("Opens at 08:30 AM")).toBeInTheDocument() // Canteen
    expect(screen.getByText("Starts at 07:30 AM")).toBeInTheDocument() // Transport
    expect(screen.getByText("Opens at 09:00 AM")).toBeInTheDocument() // IT Support
    expect(screen.getByText("Emergency Only")).toBeInTheDocument() // Medical
    expect(screen.getByText("24x7 Active")).toBeInTheDocument() // Security

    // Filter by Closed
    const closedFilterBtn = screen.getByRole("button", { name: /Closed/i })
    fireEvent.click(closedFilterBtn)

    // Security should no longer be visible in the filtered list
    expect(screen.queryByText("24 Hours Active")).not.toBeInTheDocument()

    // Reset filter
    const allFilterBtn = screen.getByRole("button", { name: /All Services/i })
    fireEvent.click(allFilterBtn)

    // Open Library modal
    const libraryTitle = screen.getByText("Library")
    fireEvent.click(libraryTitle)

    // Check modal displays "Currently Closed" banner and working hours
    expect(screen.getByText("Currently Closed")).toBeInTheDocument()
    expect(screen.getByText("08:00 AM – 08:00 PM")).toBeInTheDocument()
  })
})
