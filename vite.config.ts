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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("/react/")) {
              return "vendor-react"
            }
            if (id.includes("@supabase")) {
              return "vendor-supabase"
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons"
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
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
