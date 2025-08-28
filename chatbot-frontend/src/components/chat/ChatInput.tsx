// src/components/chat/ChatInput.tsx
import React, { useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

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
    <div className="border-t border-gray-700 p-4 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm flex items-end">
      <div className="flex-1 w-full relative">
        <div className="flex items-center bg-gray-700 rounded-2xl pl-4 pr-2 py-2 border border-gray-600 shadow-lg focus-within:border-[#2c5364] focus-within:ring-2 focus-within:ring-[#445963] transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent border-0 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-sm disabled:opacity-50"
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="ml-2 bg-gradient-to-r from-[#142d38] via-[#203a43] to-[#2c5364]  FFp-2 rounded-full text-white shadow-md border-1 hover:shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-md"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInput;