"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, X, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AI_RESPONSES: Record<string, string> = {
  "attendance": "Your attendance this month is 87%. You're doing great! 📊",
  "absent": "Let me check... Based on today's records, 3 students are absent in CSE-A.",
  "test": "You have a Mathematics test tomorrow at 10:00 AM. Don't forget to review Chapter 5! 📚",
  "default": "I'm here to help! Try asking about your attendance, upcoming tests, or class information. 🎓",
};

export default function AskNAMMA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm NAMMA, your campus AI assistant. Ask me anything! 🤖",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("attendance") || lowerQuery.includes("present")) {
      return AI_RESPONSES.attendance;
    }
    if (lowerQuery.includes("absent") || lowerQuery.includes("who is not")) {
      return AI_RESPONSES.absent;
    }
    if (lowerQuery.includes("test") || lowerQuery.includes("exam") || lowerQuery.includes("remind")) {
      return AI_RESPONSES.test;
    }
    
    return AI_RESPONSES.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 500);
  };

  return (
    <>
      {/* Floating Orb Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[#FACC15] to-purple-500 shadow-[0_8px_32px_rgba(250,204,21,0.4)] flex items-center justify-center cursor-pointer group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FACC15] to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse" />
        <MessageCircle className="w-8 h-8 text-white relative z-10" />
        {!isOpen && (
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Chat Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              className="fixed bottom-24 left-6 w-96 h-[500px] z-50 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              {/* Header */}
              <div className="relative p-4 bg-gradient-to-r from-[#FACC15]/20 to-purple-500/20 border-b border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FACC15]/0 via-[#FACC15]/10 to-purple-500/0" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#FACC15] rounded-full blur-md opacity-50 animate-pulse" />
                    <Bot className="w-6 h-6 text-[#FACC15] relative z-10" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Ask NAMMA</h3>
                    <p className="text-xs text-gray-400">Campus AI Assistant</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[380px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white/10 backdrop-blur-sm text-gray-100 border border-white/20"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === "ai" && (
                          <Sparkles className="w-4 h-4 text-[#FACC15] flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10 bg-gray-900/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FACC15]/50 focus:border-transparent"
                  />
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-gradient-to-r from-[#FACC15] to-purple-500 text-white rounded-lg hover:from-[#FACC15]/90 hover:to-purple-500/90 transition-all shadow-[0_4px_20px_rgba(250,204,21,0.3)]"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


