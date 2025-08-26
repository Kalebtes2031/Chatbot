// src/services/chatApi.ts
import axios from "axios";
import type { ChatMessage } from "../types/chat";

export async function useChatApi(message: string): Promise<string> {
  try {
    const response = await axios.post("http://localhost:8000/api/chathf/", { message });

    // If your backend returns { reply: { role, content, ... } }
    if (response.data.reply && typeof response.data.reply === "object") {
      return response.data.reply.content || "";
    }

    // fallback: string
    if (typeof response.data.reply === "string") {
      return response.data.reply;
    }

    return JSON.stringify(response.data); // just in case
  } catch (error: any) {
    console.error("Chat API Error:", error);
    throw new Error("Failed to fetch response from server");
  }
}
