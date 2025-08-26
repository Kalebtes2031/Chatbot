// src/Chatbot.tsx
import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import axios from "axios";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  time: Date;
}

// Component to render formatted messages with markdown support
const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const renderFormattedText = (text: string) => {
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Handle code blocks
      if (part.startsWith('```') && part.endsWith('```')) {
        const languageMatch = part.match(/^```(\w+)\n/);
        const language = languageMatch ? languageMatch[1] : '';
        const code = part.replace(/^```(\w+)?\n/, '').replace(/```$/, '');
        
        return (
          <div key={index} className="my-2">
            {language && (
              <div className="bg-gray-800 text-gray-200 text-xs px-3 py-1 rounded-t-md font-mono">
                {language}
              </div>
            )}
            <pre className={`bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto text-sm font-mono ${
              language ? 'rounded-t-none' : ''
            }`}>
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      // Process inline formatting for non-code parts
      const elements: React.JSX.Element[] = [];
      let currentText = part;
      
      // Handle bold text
      const boldParts = currentText.split(/(\*\*[^*]+\*\*)/g);
      boldParts.forEach((boldPart, boldIndex) => {
        if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
          const boldContent = boldPart.slice(2, -2);
          elements.push(<strong key={`bold-${boldIndex}`} className="font-semibold">{boldContent}</strong>);
        } else {
          // Handle inline code
          const codeParts = boldPart.split(/(`[^`]+`)/g);
          codeParts.forEach((codePart, codeIndex) => {
            if (codePart.startsWith('`') && codePart.endsWith('`')) {
              const codeContent = codePart.slice(1, -1);
              elements.push(
                <code key={`code-${boldIndex}-${codeIndex}`} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                  {codeContent}
                </code>
              );
            } else {
              elements.push(<span key={`text-${boldIndex}-${codeIndex}`}>{codePart}</span>);
            }
          });
        }
      });
      
      return <div key={index}>{elements}</div>;
    });
  };

  return <div className="whitespace-pre-wrap">{renderFormattedText(content)}</div>;
};

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: message, time: new Date() };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chathf/", {
        message: userMessage.content,
      });

      const replyContent = response.data?.reply?.content || "No reply received";

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: replyContent,
        time: new Date(),
      };

      setChat((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "I apologize, but I'm experiencing technical difficulties at the moment. Please try again shortly.",
        time: new Date(),
      };
      setChat((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-96 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Professional Assistant</h2>
            <div className="flex items-center">
              <span className="h-2 w-2 bg-green-400 rounded-full mr-1"></span>
              <span className="text-xs text-indigo-100">Online</span>
            </div>
          </div>
        </div>
        <button className="text-indigo-100 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {chat.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="bg-indigo-100 p-5 rounded-full mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">How can I help you today?</h3>
            <p className="max-w-xs">I'm your professional assistant, ready to answer questions and provide insights on your projects and queries.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs md:max-w-md rounded-lg p-4 ${msg.role === "user" 
                  ? "bg-indigo-600 text-white rounded-br-none" 
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm"}`}
                >
                  {msg.role === "assistant" ? (
                    <FormattedMessage content={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <div className={`text-xs mt-2 ${msg.role === "user" ? "text-indigo-200" : "text-gray-500"}`}>
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-none p-4 max-w-xs border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">Thinking</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 bg-gray-100 rounded-l-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button 
            onClick={sendMessage} 
            disabled={!message.trim()}
            className={`p-3 rounded-r-lg ${message.trim() 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
              : "bg-gray-300 text-gray-400 cursor-not-allowed"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;