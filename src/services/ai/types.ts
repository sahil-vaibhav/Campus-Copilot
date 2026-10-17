export type CampusIntent = "timetable" | "notices" | "library" | "faculty" | "location" | "services" | "general"
export type CampusAnswer = { text: string; source: string }
export interface AiService {
  ask(
    question: string,
    history?: { role: string; content: string }[],
    userName?: string,
    language?: string
  ): Promise<CampusAnswer>
}


