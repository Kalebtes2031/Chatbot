// src/components/chat/MessageList.tsx
import React from "react";
import type { ChatMessage } from "../../types/chat";
import TypingIndicator from "./TypingIndicator";

interface Props {
  messages: ChatMessage[];
  isTyping: boolean;
}

const MessageList: React.FC<Props> = ({ messages, isTyping }) => {
  return (
    <div className="space-y-4">
      {messages.length === 0 && (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
            <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">Welcome to ChatAssistant</h3>
          <p className="text-slate-500">Ask me anything, and I'll do my best to help you!</p>
        </div>
      )}
      
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-100 text-slate-800 rounded-bl-none"
            }`}
          >
            <div className="whitespace-pre-wrap">{message.content}</div>
            <div
              className={`text-xs mt-1 ${message.role === "user" ? "text-blue-200" : "text-gray-500"}`}
            >
              {new Date(message.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-gray-100 px-4 py-3">
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;