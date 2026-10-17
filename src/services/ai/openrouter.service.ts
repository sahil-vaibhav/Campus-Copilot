import type { AiService, CampusAnswer } from "./types"
import { supabase } from "../../lib/supabase"

/**
 * AI service that calls the Supabase Edge Function "campus-copilot",
 * which proxies requests to OpenRouter's API and enriches them with
 * live database context.
 *
 * Falls back to the mock service if Supabase is not configured.
 */
export const openRouterService: AiService = {
  async ask(
    question: string,
    history: { role: string; content: string }[] = [],
    userName?: string,
    language?: string
  ): Promise<CampusAnswer> {
    if (!supabase) {
      throw new Error("Supabase is not configured — cannot reach AI backend")
    }

    const { data, error } = await supabase.functions.invoke("campus-copilot", {
      body: { question, history, userName, language },
    })

    if (error) {
      console.error("Edge function invocation error:", error)
      throw new Error(error.message || "Failed to reach Campus Copilot AI")
    }

    if (
      !data ||
      typeof data.text !== "string" ||
      !data.text.trim() ||
      data.text.toLowerCase().includes("currently unreachable") ||
      /^error:/i.test(data.text.trim())
    ) {
      throw new Error(data?.text || "Invalid or unreachable response from Campus Copilot AI")
    }

    return {
      text: data.text,
      source: data.source || "Campus Copilot AI",
    }
  },
}
