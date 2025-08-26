// src/pages/ChatPage.tsx
import React, { useState } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import { useChatApi } from "../services/chatApi";
import type { ChatMessage } from "../types/chat";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await useChatApi(input);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        time: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "⚠️ Sorry, I encountered an error. Please try again.",
        time: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-[500px] bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl shadow-2xl overflow-hidden border border-white/20 transform transition-all duration-300 hover:shadow-2xl">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 backdrop-blur-sm bg-white/30">
        <MessageList messages={messages} isTyping={loading} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        disabled={loading}
      />
    </div>
  );
};

export default ChatPage;