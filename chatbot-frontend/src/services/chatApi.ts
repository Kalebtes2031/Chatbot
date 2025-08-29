// src/services/chatApi.ts
import api from "./api";
import type { ChatMessage } from "../types/chat";

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
      conversation_id: conversationId ?? null, // 👈 explicit null
    };

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await api.post(`api/chathf/`, payload, { headers });

    let replies: string[] = [];
    if (Array.isArray(response.data.replies)) {
      replies = response.data.replies;
    } else if (typeof response.data.replies === "string") {
      replies = [response.data.replies];
    }

    return {
      replies,
      conversationId: response.data.conversation_id ?? undefined,
    };
  } catch (error) {
    console.error("❌ Chat API Error:", error);
    throw new Error("Failed to fetch response from server");
  }
}
