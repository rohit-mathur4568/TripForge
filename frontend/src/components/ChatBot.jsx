import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User, ChevronDown } from "lucide-react";

const INITIAL_MESSAGES = [
  {
    sender: "bot",
    text: "Hello! 👋 I'm your TripForge AI Assistant. Ask me anything about our multi-agent trip planner, interactive Leaflet route maps, calendar export, or budget optimization!",
    suggestions: [
      "What is TripForge?",
      "How do I start planning a trip?",
      "What features are included?",
      "Popular destinations"
    ]
  }
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "I'm happy to help you explore TripForge! Ask me about planning trips, saved journeys, or custom maps.",
          suggestions: data.suggestions || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "TripForge AI is currently online! Ask me how our multi-agent supervisor, itinerary builder, or budget optimizer works.",
          suggestions: ["What is TripForge?", "How do I start planning?"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-[#173d2e] hover:bg-[#20533f] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition duration-300 transform hover:scale-105 border border-emerald-500/30 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#eaff9d]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden sm:inline-block font-extrabold text-sm tracking-wide">
            Ask TripForge AI
          </span>
        </button>
      )}

      {/* Responsive Chat Panel */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] max-w-[380px] sm:max-w-[400px] h-[520px] max-h-[80vh] bg-white border border-[#e1eadb] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-[#173d2e] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#eaff9d]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-snug">TripForge AI Assistant</h4>
                <p className="text-[11px] text-[#cbd9cf] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Always active & responsive
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fbfdf9] text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-[#edf8d9] text-[#173d2e] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-3.5 ${
                  msg.sender === "user"
                    ? "bg-[#173d2e] text-white rounded-tr-none font-medium shadow-sm"
                    : "bg-white border border-[#e2eadc] text-slate-800 rounded-tl-none shadow-sm"
                }`}>
                  <p className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">{msg.text}</p>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(suggestion)}
                          className="text-[11px] font-bold text-[#173d2e] bg-[#edf8d9] hover:bg-[#d7eba9] px-2.5 py-1 rounded-full border border-emerald-200 transition cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-[#173d2e] text-[#eaff9d] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold p-2">
                <Bot className="w-4 h-4 text-[#173d2e] animate-bounce" />
                TripForge Assistant is thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 border-t border-[#e1eadb] dark:border-white/10 bg-white dark:bg-[#121417] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about TripForge features..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#fbfdf9] dark:bg-[#1a1d21] border border-[#dce6d5] dark:border-white/10 focus:outline-none focus:border-[#39734f] text-[#17211a] dark:text-white"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-xl bg-[#173d2e] dark:bg-teal-500 text-[#eaff9d] dark:text-slate-950 hover:bg-[#20533f] transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
