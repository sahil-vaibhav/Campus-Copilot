import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import FeedbackPage from "./FeedbackPage"

vi.mock("../contexts/AuthContext", () => ({ useAuth: () => ({ user: null }) }))
vi.mock("../lib/supabase", () => ({ isSupabaseConfigured: false, supabase: null }))

describe("FeedbackPage", () => {
  it("requires a category and description before accepting a complaint", async () => {
    render(<FeedbackPage />)
    fireEvent.click(screen.getByRole("button", { name: "Submit Feedback" }))
    expect(screen.queryByText("Feedback submitted successfully!")).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Infrastructure" } })
    fireEvent.change(screen.getByPlaceholderText("Describe your issue or feedback in detail..."), { target: { value: "A classroom projector needs repair." } })
    fireEvent.click(screen.getByRole("button", { name: "Submit Feedback" }))
    await waitFor(() => expect(screen.getByText("Feedback submitted successfully!")).toBeInTheDocument())
  })
})
