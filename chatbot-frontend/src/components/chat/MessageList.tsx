// src/components/chat/MessageList.tsx
import React from "react";
import type { ChatMessage } from "../../types/chat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useChatScroll } from "../../hooks/useChatScroll";

const MessageList: React.FC<{ messages: ChatMessage[]; isTyping: boolean }> = ({
  messages,
  isTyping,
}) => {
  const bottomRef = useChatScroll(messages);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-transparent">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 animate-fade-in">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-5 rounded-full mb-4 shadow-md transform transition-all duration-500 hover:scale-105">
            <svg
              className="w-10 h-10 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            How can I help you today?
          </h3>
          <p className="max-w-xs text-gray-500">
            I'm your professional assistant, ready to answer questions and
            provide insights.
          </p>
          <div className="mt-4 flex space-x-2">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;