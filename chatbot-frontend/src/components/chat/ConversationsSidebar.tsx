// src/components/chat/ConversationsSidebar.tsx
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import {
  ChatBubbleLeftIcon,
  CalendarDaysIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface Conversation {
  id: number;
  title: string;
  created_at: string;
}

interface Props {
  conversations: Conversation[];
  onSelect: (conversationId: number | undefined) => void;
  refresh: () => void;
  loading: boolean;
}

const ConversationsSidebar: React.FC<Props> = ({
  conversations,
  onSelect,
  refresh,
  loading,
}) => {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) return null;

  const deleteConversation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await api.delete(`api/conversations/${id}/delete/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      refresh();
    } catch (err) {
      console.error("Error deleting conversation", err);
    }
  };

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
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 flex flex-col shadow-xl">
      <div className="p-3 sm:p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
          Conversation History
        </h2>
        <div className="relative group">
          <button
            onClick={() => onSelect(undefined)}
            className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-[#142d38] via-[#203a43] to-[#2c5364] text-white hover:from-[#2c5364] hover:via-[#203a43] hover:to-[#142d38] transition-all shadow-md hover:shadow-purple-400/20 transform hover:scale-105 duration-200"
            aria-label="New conversation"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          {/* Professional tooltip for md+ screens */}
          <div className="hidden md:block absolute -top-7 left-1/2 -translate-x-1/2 z-10">
            <div className="relative">
              <div className="bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-gray-700">
                New Chat
                {/* Tooltip arrow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-gray-800 transform rotate-45 border-b border-r border-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-10 px-4">
            <ChatBubbleLeftIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm sm:text-base">
              No conversations yet
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Start a new chat to see it here
            </p>
          </div>
        ) : (
          <ul className="space-y-1 sm:space-y-2">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                className="p-2 sm:p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200 border border-transparent hover:border-purple-400/20 flex justify-between items-center group"
              >
                <div
                  onClick={() => onSelect(conv.id)}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="font-medium text-white truncate text-sm sm:text-base group-hover:text-purple-200 transition-colors">
                    {conv.title || `Conversation ${conv.id}`}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mt-1 sm:mt-2 group-hover:text-gray-300 transition-colors">
                    <CalendarDaysIcon className="text-white h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                    {formatDate(conv.created_at)}
                  </div>
                </div>

                <button
                  onClick={() => deleteConversation(conv.id)}
                  className="ml-1 p-1 text-gray-500 hover:text-red-400 transition-colors opacity-70 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Delete conversation"
                >
                  <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-800/50 text-center">
        <p className="text-xs text-gray-400">
          {conversations.length} conversation
          {conversations.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default ConversationsSidebar;