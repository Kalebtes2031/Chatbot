import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat";

export function useChatScroll(dep: ChatMessage[]) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dep]);

  return bottomRef;
}
