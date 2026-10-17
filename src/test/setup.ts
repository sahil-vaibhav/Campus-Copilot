import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

afterEach(() => {
  cleanup()
  localStorage.clear()
})

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: () => undefined })
