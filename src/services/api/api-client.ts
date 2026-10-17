const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new Error("Campus API is not configured")
  const response = await fetch(new URL(path, API_BASE_URL), {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!response.ok) throw new Error(`Campus API request failed (${response.status})`)
  return response.json() as Promise<T>
}
