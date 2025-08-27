import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  ChatBubbleLeftIcon,
  CalendarDaysIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Conversation {
  id: number;
  title: string;
  created_at: string;
}

interface Props {
  onSelect: (conversationId: number) => void;
}

const ConversationsSidebar: React.FC<Props> = ({ onSelect }) => {
  const { accessToken } = useContext(AuthContext);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    fetchConversations();
  }, [accessToken]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/conversations/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/conversations/${id}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting conversation", err);
    }
  };

  if (!accessToken) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="w-72 h-full bg-white border-r border-gray-100 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <ChatBubbleLeftIcon className="h-6 w-6 mr-2 text-blue-500" />
          Conversation History
        </h2>
        <p className="text-sm text-gray-500 mt-1">Your recent conversations</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-10 px-4">
            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start a new chat to see it here
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                className="p-4 rounded-lg hover:bg-blue-50/50 transition-all duration-200 border border-transparent hover:border-blue-100 flex justify-between items-center"
              >
                {/* left side (title + date) */}
                <div
                  onClick={() => onSelect(conv.id)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium text-slate-800 truncate">
                    {conv.title || `Conversation ${conv.id}`}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <CalendarDaysIcon className="h-3.5 w-3.5 mr-1" />
                    {formatDate(conv.created_at)}
                  </div>
                </div>

                {/* delete button */}
                <button
                  onClick={() => deleteConversation(conv.id)}
                  className="ml-3 text-gray-400 hover:text-red-500 transition"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
        <p className="text-xs text-gray-500">
          {conversations.length} conversation
          {conversations.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default ConversationsSidebar;
