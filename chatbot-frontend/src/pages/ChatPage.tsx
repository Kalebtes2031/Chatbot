// src/pages/ChatPage.tsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import ConversationsSidebar from "../components/chat/ConversationsSidebar";
import { useChatApi } from "../services/chatApi";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import type { ChatMessage } from "../types/chat";

const ChatPage: React.FC = () => {
  const { accessToken } = useContext(AuthContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ read conversationId from query param
  const [searchParams] = useSearchParams();
  const queryConversationId = searchParams.get("conversationId");

  useEffect(() => {
    if (queryConversationId) {
      setConversationId(Number(queryConversationId));
    }
  }, [queryConversationId]);

  // ✅ reset for anonymous
  useEffect(() => {
    if (!accessToken) {
      setConversationId(undefined);
      setMessages([]);
    }
  }, [accessToken]);

  // ✅ scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ fetch conversation if logged-in + convId changes
  useEffect(() => {
    if (accessToken && conversationId) {
      fetchConversation(conversationId);
    }
  }, [conversationId, accessToken]);

  const fetchConversation = async (convId: number) => {
    if (!accessToken) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/account/conversations/${convId}/`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const messagesFromApi: ChatMessage[] = res.data.messages.map((m: any) => ({
        id: m.id.toString(),
        role: m.role,
        content: m.content,
        time: m.created_at,
      }));

      // ✅ replace old messages, don't append
      setMessages(messagesFromApi);
      setSidebarOpen(false);
    } catch (err) {
      console.error("❌ Failed to fetch conversation:", err);
    }
  };

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
      const token = accessToken ?? undefined;
      const { replies, conversationId: newConvId } = await useChatApi(
        [...messages, userMsg],
        token,
        conversationId
      );

      if (newConvId && newConvId !== conversationId) {
        setConversationId(newConvId); // ✅ triggers fetchConversation automatically
      }

      const assistantMsgs: ChatMessage[] = replies.map((r, index) => ({
        id: (Date.now() + index).toString(),
        role: "assistant",
        content: r,
        time: new Date().toISOString(),
      }));

      setMessages((prev) => [...prev, ...assistantMsgs]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 999).toString(),
          role: "assistant",
          content: "⚠️ Sorry, I encountered an error. Please try again.",
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-2 md:p-4">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {accessToken && (
        <div
          className={`fixed md:relative z-30 h-full transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <ConversationsSidebar onSelect={setConversationId} />
        </div>
      )}

      <div className="flex-1 flex flex-col h-full w-full">
        <div className="flex flex-col h-full max-h-[800px] w-full max-w-4xl bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden  mx-auto transform transition-all duration-300 hover:shadow-purple-500/10">
          <ChatHeader
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />

          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-gray-800/80 to-gray-900/80">
            <MessageList messages={messages} isTyping={loading} />
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;