import { describe, expect, it } from "vitest"
import { detectIntent, mockAiService } from "./mock-ai.service"

describe("campus assistant service", () => {
  it.each([
    ["What's my timetable today?", "timetable"],
    ["Show exam notices", "notices"],
    ["Find an AI book", "library"],
    ["Who teaches Operating Systems?", "faculty"],
    ["Where is the CSE department?", "location"],
    ["suggest books for subject Database", "library"],
    ["canteen timing", "services"],
    ["what time does the canteen open?", "services"],
  ] as const)("detects %s as %s", (question, intent) => {
    expect(detectIntent(question)).toBe(intent)
  })

  it("returns a grounded timetable answer with a source", async () => {
    const answer = await mockAiService.ask("When is my next class?")
    expect(answer.text).toContain("Data Structures")
    expect(answer.source).toContain("Timetable")
  })

  it("checks library database and reports availability for book queries", async () => {
    const answer = await mockAiService.ask("suggest books for subject Database")
    expect(answer.source).toContain("Library")
    expect(answer.text).toContain("Database System Concepts")
    expect(answer.text).toMatch(/Available|Checked Out|Borrowed/i)
  })

  it("returns correct canteen timing and location", async () => {
    const answer = await mockAiService.ask("canteen timing")
    expect(answer.source).toContain("Canteen")
    expect(answer.text).toContain("08:30 AM")
    expect(answer.text).toContain("06:30 PM")
    expect(answer.text).toContain("Student Center")
  })
})

