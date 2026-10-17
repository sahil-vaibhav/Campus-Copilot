import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import Topbar from "./Topbar"
import Sidebar from "./Sidebar"

const mockLogout = vi.fn()

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: {
      email: "test.student@silveroak.edu",
      user_metadata: { full_name: "Test Student", role: "student" },
    },
    isAdmin: false,
    logout: mockLogout,
  }),
}))

describe("Sidebar", () => {
  it("renders navigation links and does not render the bottom profile section", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} setIsOpen={vi.fn()} />
      </MemoryRouter>
    )

    // Check main nav items exist
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Notices")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()

    // The bottom profile section (e.g. role "Student" inside avatar card at the bottom) should NOT exist in Sidebar
    expect(screen.queryByText("test.student@silveroak.edu")).not.toBeInTheDocument()
    expect(screen.queryByText("SV")).not.toBeInTheDocument()
  })
})

describe("Topbar", () => {
  it("does not render the search box in the topbar", () => {
    render(
      <MemoryRouter>
        <Topbar onMenuClick={vi.fn()} />
      </MemoryRouter>
    )

    // Search input should not be present
    expect(screen.queryByPlaceholderText(/Search campus/i)).not.toBeInTheDocument()
  })

  it("toggles notifications panel when notification bell is clicked", () => {
    render(
      <MemoryRouter>
        <Topbar onMenuClick={vi.fn()} />
      </MemoryRouter>
    )

    const notifButton = screen.getByLabelText("Campus notifications")
    expect(screen.queryByText("Notifications")).not.toBeInTheDocument()

    // Open notifications
    fireEvent.click(notifButton)
    expect(screen.getByText("Notifications")).toBeInTheDocument()
    expect(screen.getByText("View all announcements")).toBeInTheDocument()

    // Close notifications
    fireEvent.click(notifButton)
    expect(screen.queryByText("Notifications")).not.toBeInTheDocument()
  })

  it("toggles user profile dropdown when profile avatar is clicked", () => {
    render(
      <MemoryRouter>
        <Topbar onMenuClick={vi.fn()} />
      </MemoryRouter>
    )

    const profileButton = screen.getByLabelText("User profile menu")
    expect(screen.queryByText("My Profile")).not.toBeInTheDocument()

    // Open profile menu
    fireEvent.click(profileButton)
    expect(screen.getByText("My Profile")).toBeInTheDocument()
    expect(screen.getByText("Test Student")).toBeInTheDocument()
    expect(screen.getByText("test.student@silveroak.edu")).toBeInTheDocument()
    expect(screen.getByText("Log out")).toBeInTheDocument()

    // Click logout
    fireEvent.click(screen.getByText("Log out"))
    expect(mockLogout).toHaveBeenCalled()
  })
})
