// src/hooks/useChatScroll.ts
import { useEffect } from "react";
import type { RefObject } from "react";
import type { ChatMessage } from "../types/chat";

export function useChatScroll(
  dep: ChatMessage[],
  bottomRef: RefObject<HTMLDivElement>
) {
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dep, bottomRef]);
}
