"use client";
import { useState } from "react";

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unknown error");
      }

      if (data.message) {
        setMessages(prev => [...prev, data.message]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* LOGO & TITLE */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Yavuz's AI
                </h1>
                <p className="text-gray-400 text-xs">Intelligent Assistant</p>
              </div>
            </div>

            {/* STATUS INDICATOR */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CHAT */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
          {/* WELCOME SECTION */}
          {messages.length === 0 && (
            <div className="p-8 text-center border-b border-white/10">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Welcome to Yavuz's AI
              </h2>
              <p className="text-gray-300 mb-6 text-sm">
                Your intelligent partner for creativity and conversation
              </p>

              {/* QUICK STARTERS */}
              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                <button
                  onClick={() => setInput("What can you help me with?")}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all duration-200 group hover:scale-105"
                >
                  <div className="text-cyan-400 text-sm mb-1">💡</div>
                  <p className="text-white text-xs font-medium">Get Started</p>
                </button>
                <button
                  onClick={() => setInput("Tell me about your capabilities")}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all duration-200 group hover:scale-105"
                >
                  <div className="text-blue-400 text-sm mb-1">🚀</div>
                  <p className="text-white text-xs font-medium">Features</p>
                </button>
              </div>
            </div>
          )}

          {/* ERROR DISPLAY */}
          {error && (
            <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2 rounded-xl backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚠️</span>
                <span className="text-sm font-medium">Error:</span>
              </div>
              <p className="text-xs mt-1">{error}</p>
            </div>
          )}

          {/* MESSAGES */}
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 backdrop-blur-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                      : "bg-white/10 text-gray-100 border border-white/10 shadow-lg"
                  } transition-all duration-300 hover:scale-[1.02]`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-100 border border-white/10 rounded-2xl px-4 py-3 max-w-[85%] backdrop-blur-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-300">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT FORM */}
          <div className="p-4 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Message Yavuz's AI..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 backdrop-blur-lg transition-all duration-200 text-sm"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 flex items-center gap-2 min-w-[80px] justify-center text-sm"
              >
                {isLoading ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </form>

            {/* QUICK ACTIONS */}
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
              {[
                "Hello! 👋",
                "What can you do?",
                "Tell me a joke",
                "Help me code",
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-xs transition-all duration-200 hover:scale-105"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full py-6 bg-transparent mt-8">
          <div className="max-w-4xl mx-auto px-4 flex flex-col items-center pt-4 border-t border-white/10">
            {/* SOCIAL LINKS */}
            <div className="flex space-x-6 mb-4">
              <a
                href="https://linkedin.com/in/yavuztokus/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.452 20.452h-3.554v-5.569c0-1.328-.027-3.04-1.852-3.04-1.853 0-2.136 1.447-2.136 2.941v5.668H9.354V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.599 0 4.266 2.368 4.266 5.451v6.292zM5.337 7.433c-1.144 0-2.069-.925-2.069-2.069a2.07 2.07 0 114.138 0c0 1.144-.925 2.069-2.069 2.069zM6.991 20.452H3.683V9h3.308v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.546C0 23.225.792 24 1.771 24h20.451C23.207 24 24 23.225 24 22.273V1.727C24 .774 23.207 0 22.225 0z" />
                </svg>
              </a>
              <a
                href="https://github.com/yavuzdeveloper"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 0C5.372 0 0 5.373 0 12a12 12 0 008.208 11.386c.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.415-4.042-1.415-.547-1.39-1.335-1.76-1.335-1.76-1.091-.746.082-.731.082-.731 1.205.084 1.84 1.237 1.84 1.237 1.072 1.835 2.812 1.305 3.496.998.108-.776.42-1.305.763-1.605-2.665-.303-5.467-1.334-5.467-5.934 0-1.312.468-2.382 1.236-3.222-.124-.303-.536-1.524.116-3.176 0 0 1.008-.323 3.3 1.23a11.49 11.49 0 016 0c2.29-1.554 3.296-1.23 3.296-1.23.653 1.652.24 2.873.118 3.176.77.84 1.234 1.91 1.234 3.222 0 4.61-2.806 5.628-5.479 5.924.43.372.823 1.104.823 2.226v3.293c0 .319.218.69.824.574A12.004 12.004 0 0024 12c0-6.627-5.373-12-12-12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            {/* COPYRIGHT TEXT */}
            <div className="text-center">
              <p className="text-gray-500 text-xs">
                © 2025 Yavuz Tokus. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
