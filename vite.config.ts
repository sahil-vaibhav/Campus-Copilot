import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { fileURLToPath, URL } from "url"
import { defineConfig as defineTestConfig } from "vitest/config"

// https://vite.dev/config/
export default defineTestConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    restoreMocks: true,
    pool: "threads",
    maxWorkers: 1,
    isolate: false,
  },
})
