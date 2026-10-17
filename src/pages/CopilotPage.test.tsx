import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import CopilotPage from "./CopilotPage"

// Mock the campus AI service to avoid hitting the real Edge Function in tests.
vi.mock("../services/ai/campus-ai.service", () => ({
  campusAiService: {
    ask: vi.fn().mockResolvedValue({
      text: "Your next class is Data Structures at 09:00 AM in Room 302. You also have 2 more classes today.",
      source: "Timetable · Updated today",
    }),
  },
}))

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "u-123",
      email: "modi@silveroak.edu",
      user_metadata: { full_name: "Modi Student" },
    },
    isAdmin: false,
    logout: vi.fn(),
  }),
}))

describe("CopilotPage", () => {
  it("displays greeting with user's first name", () => {
    render(<CopilotPage />)
    expect(screen.getByText(/Hi Modi!/)).toBeInTheDocument()
  })

  it("sends a question to the campus assistant and shows its answer with user initials", async () => {
    render(<CopilotPage />)
    fireEvent.change(screen.getByRole("textbox", { name: "Ask Campus Copilot" }), {
      target: { value: "When is my next class?" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Send" }))

    // User message should display user's initials ("MS"), NOT hardcoded "SV"
    await waitFor(() => expect(screen.getByText("MS")).toBeInTheDocument())
    expect(screen.queryByText("SV")).not.toBeInTheDocument()

    // AI answer should be rendered
    await waitFor(() =>
      expect(screen.getByText(/Your next class is Data Structures/)).toBeInTheDocument()
    )
    expect(screen.getAllByText(/Timetable · Updated today/).length).toBeGreaterThan(0)
  })
})
