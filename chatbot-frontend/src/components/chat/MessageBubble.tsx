import React from "react";
import type { ChatMessage } from "../../types/chat";
import Markdown from "./Markdown";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md rounded-2xl p-4 ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none shadow-sm"
        }`}
      >
        <Markdown content={msg.content} />
        <div
          className={`text-xs mt-2 ${
            isUser ? "text-indigo-200" : "text-gray-500"
          }`}
        >
          {formatTime(msg.time)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
