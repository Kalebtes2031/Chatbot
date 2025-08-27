// src/services/chatApi.ts
import axios from "axios";
import type { ChatMessage } from "../types/chat";

const API_URL = import.meta.env.VITE_API_URL;

export async function useChatApi(
  messages: ChatMessage[],
  accessToken?: string,
  conversationId?: number
): Promise<{
  replies: string[];
  conversationId?: number;
}> {
  try {
    const payload = {
      messages: messages.map(({ role, content }) => ({ role, content })),
      conversation_id: conversationId,
    };

    const headers: any = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const response = await axios.post(`${API_URL}/api/chathf/`, payload, {
      headers,
    });

    return {
      replies: Array.isArray(response.data.replies)
        ? response.data.replies
        : [],
      conversationId: response.data.conversation_id,
    };
  } catch (error: any) {
    console.error("Chat API Error:", error);
    throw new Error("Failed to fetch response from server");
  }
}
