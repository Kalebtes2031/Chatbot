// src/components/chat/ChatHeader.tsx
import React from "react";

const ChatHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="flex items-center space-x-3">
        <div className="bg-white p-2 rounded-full">
          <svg
            className="w-6 h-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Kabth Assistant</h2>
          <div className="flex items-center">
            <span className="h-2 w-2 bg-green-400 rounded-full mr-1" />
            <span className="text-xs text-indigo-100">Online</span>
          </div>
        </div>
      </div>
      <button className="text-indigo-100 hover:text-white" aria-label="Close">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatHeader;
