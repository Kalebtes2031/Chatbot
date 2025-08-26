// src/services/chatApi.ts
import axios from "axios";
import type { ChatMessage } from "../types/chat";

const API_URL = import.meta.env.VITE_API_URL;

export async function useChatApi(messages: ChatMessage[]): Promise<string[]> {
  try {
    // Only send role and content
    const payload = messages.map(({ role, content }) => ({ role, content }));

    const response = await axios.post(`${API_URL}/chathf/`, { messages: payload });

    if (Array.isArray(response.data.replies)) return response.data.replies;
    if (response.data.reply && typeof response.data.reply === "object") return [response.data.reply.content || ""];
    if (typeof response.data.reply === "string") return [response.data.reply];

    return [JSON.stringify(response.data)];
  } catch (error: any) {
    console.error("Chat API Error:", error);
    throw new Error("Failed to fetch response from server");
  }
}
