// src/components/chat/MessageList.tsx
import React from "react";
import type { ChatMessage } from "../../types/chat";
import TypingIndicator from "./TypingIndicator";
import Markdown from "./Markdown";

interface Props {
  messages: ChatMessage[];
  isTyping: boolean;
}

const MessageList: React.FC<Props> = ({ messages, isTyping }) => {
  return (
    <div className="space-y-6 p-2">
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center w-full h-[180px] rounded-2xl mb-4">
            <img src="/KABTHAILOGO3.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Welcome to KABTH AI Assistant</h3>
          <p className="text-gray-500 max-w-md mx-auto">Start a conversation by typing a message below. I'm here to help with any questions you might have!</p>
        </div>
      )}
      
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-lg ${message.role === "user"
              ? "bg-gradient-to-r from-[#142d38] via-[#203a43] to-[#2c5364] text-white rounded-br-none"
              : "bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600"
            }`}
          >
            <Markdown content={message.content} />
            
            <div
              className={`text-xs mt-2 flex justify-end ${message.role === "user" ? "text-blue-200/80" : "text-gray-400"}`}
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
          <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-gray-700 px-5 py-4 border border-gray-600">
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;