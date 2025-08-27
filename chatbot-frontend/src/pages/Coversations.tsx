// src/pages/ConversationsPage.tsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

interface Conversation {
  id: number;
  title: string;
  last_message: string;
  updated_at: string;
}

const ConversationsPage: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversations/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setConversations(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [accessToken]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-600">
          Please <Link to="/login" className="text-indigo-600 underline">login</Link> to see your chat history.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6">Your Conversations</h1>

      {loading && <p>Loading conversations...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && conversations.length === 0 && (
        <p className="text-gray-600">No conversations yet. Start a new chat!</p>
      )}

      <div className="w-full max-w-md space-y-3">
        {conversations.map((conv) => (
          <Link
            key={conv.id}
            to={`/chat?conversationId=${conv.id}`}
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-all"
          >
            <h2 className="font-semibold">{conv.title || `Conversation #${conv.id}`}</h2>
            <p className="text-gray-500 text-sm truncate">{conv.last_message}</p>
            <p className="text-gray-400 text-xs mt-1">
              {new Date(conv.updated_at).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ConversationsPage;
