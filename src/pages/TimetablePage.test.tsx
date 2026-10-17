import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import TimetablePage from "./TimetablePage"

describe("TimetablePage", () => {
  it("shows Monday classes and filters when another day is selected", () => {
    render(<TimetablePage />)
    expect(screen.getByText("Data Structures")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Tuesday" }))
    expect(screen.getByText("Operating Systems")).toBeInTheDocument()
    expect(screen.queryByText("Data Structures")).not.toBeInTheDocument()
  })
})
