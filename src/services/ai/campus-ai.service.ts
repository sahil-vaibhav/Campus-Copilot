import type { AiService, CampusAnswer } from "./types"
import { openRouterService } from "./openrouter.service"
import { mockAiService } from "./mock-ai.service"
import { isSupabaseConfigured } from "../../lib/supabase"

/**
 * Unified campus AI service.
 *
 * - When Supabase is configured → calls the Edge Function (OpenRouter API + DB context)
 * - Otherwise → falls back to the local mock service for offline/demo use
 *
 * If the OpenRouter call fails at runtime, it also falls back to mock
 * so the chatbot never completely breaks.
 */
export const campusAiService: AiService = {
  async ask(
    question: string,
    history: { role: string; content: string }[] = [],
    userName?: string,
    language?: string
  ): Promise<CampusAnswer> {
    const lang =
      language ||
      (typeof localStorage !== "undefined"
        ? localStorage.getItem("campus-copilot-language") || "English"
        : "English")

    // Try OpenRouter via Supabase Edge Function first
    if (isSupabaseConfigured) {
      try {
        return await openRouterService.ask(question, history, userName, lang)
      } catch (err) {
        console.warn("OpenRouter service failed, falling back to mock:", err)
        // Fall through to mock
      }
    }

    // Fallback: local mock service (works offline / without API key)
    return mockAiService.ask(question, history, userName, lang)
  },
}
