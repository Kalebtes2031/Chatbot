// src/types/chat.ts
export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  time: string; // ISO string for consistency
}
