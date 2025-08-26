// src/components/chat/ChatInput.tsx
import React, { useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<Props> = ({ value, onChange, onSend, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(160, el.scrollHeight) + "px";
  }, [value]);

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-gray-200/50 p-4 bg-white/80 backdrop-blur-sm flex items-end">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="w-full resize-none rounded-2xl border-0 bg-white/90 shadow-sm pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-300"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="absolute right-2 bottom-3 bg-gradient-to-r from-indigo-600 to-purple-600 p-1.5 rounded-full text-white shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-sm"
          aria-label="Send message"
        >
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
              d="M13 5l7 7-7 7M5 5l7 7-7 7" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;