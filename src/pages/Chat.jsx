import React, { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaTrash,
  FaGithub,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

const BACKEND_URL = "https://backend-chatbot-bc8w.onrender.com";

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm your AI assistant powered by semantic search and advanced NLP. Ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      const botText = data.response || data.reply || "I couldn't process that request.";

      setTyping(false);

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: botText,
        sources: data.sources || [],
        confidence: data.confidence,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error:", err);
      setTyping(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Sorry, I'm having trouble connecting to the server. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Clear chat
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: "Chat cleared! How can I help you?",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Copy message
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Format message text with markdown-like formatting
  const formatMessage = (text) => {
    if (typeof text !== "string") return text;
    
    // Split by newlines and create paragraphs
    const lines = text.split("\n").filter((line) => line.trim());
    
    return lines.map((line, idx) => {
      // Check for bullet points
      if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
        return (
          <li key={idx} className="ml-4">
            {line.replace(/^[-•]\s*/, "")}
          </li>
        );
      }
      
      // Check for numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <li key={idx} className="ml-4">
            {line.replace(/^\d+\.\s*/, "")}
          </li>
        );
      }
      
      // Regular paragraph
      return (
        <p key={idx} className="mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-purple-500/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaRobot className="text-4xl text-purple-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
              <p className="text-xs text-purple-300">Powered by Semantic Search & NLP</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all hover:scale-105 border border-red-500/30"
              title="Clear chat"
            >
              <FaTrash className="text-sm" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <a
              href="https://github.com/fadihamad40984/backend-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all hover:scale-105 border border-purple-500/30"
            >
              <FaGithub className="text-lg" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                    : "bg-gradient-to-br from-blue-500 to-cyan-500"
                }`}
              >
                {msg.sender === "user" ? (
                  <FaUser className="text-white text-sm" />
                ) : (
                  <FaRobot className="text-white text-sm" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[75%] ${
                  msg.sender === "user" ? "items-end" : "items-start"
                } flex flex-col gap-1`}
              >
                <div
                  className={`relative px-5 py-3 rounded-2xl shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-sm"
                      : "bg-gradient-to-br from-slate-800 to-slate-900 text-gray-100 border border-purple-500/20 rounded-tl-sm"
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                    {formatMessage(msg.text)}
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-purple-500/30">
                      <p className="text-xs text-purple-300 mb-2">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-200"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confidence */}
                  {msg.confidence && (
                    <div className="mt-2 text-xs text-purple-300">
                      Confidence: {(msg.confidence * 100).toFixed(0)}%
                    </div>
                  )}

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 p-2 rounded-full shadow-lg"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <FaCheck className="text-green-400 text-xs" />
                    ) : (
                      <FaCopy className="text-gray-300 text-xs" />
                    )}
                  </button>
                </div>

                {/* Timestamp */}
                <span className="text-xs text-gray-500 px-2">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {typing && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 px-5 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Footer */}
      <footer className="bg-black/30 backdrop-blur-xl border-t border-purple-500/20 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-purple-500/30 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={typing}
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-purple-500/25"
            >
              <FaPaperPlane className="text-lg" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-3">
            Powered by{" "}
            <a
              href="https://backend-chatbot-bc8w.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              AI Backend
            </a>{" "}
            • Uses Wikipedia, arXiv, PubMed & more
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Chat;
