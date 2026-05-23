"use client";

import React, { useState, useEffect } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { Bot, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewPrepPage() {
  const [isClient, setIsClient] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string; files?: File[] }[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartSession = () => {
    if (!roleInput.trim()) return;
    setJobRole(roleInput);
    setMessages([
      {
        role: "ai",
        content: `Hello! I'm your AI Interview Coach. We'll be practicing for the "${roleInput}" role. Are you ready to start? You can use the voice recording feature or type your response.`,
      }
    ]);
  };

  const handleSendMessage = (message: string, files?: File[]) => {
    if (!message && (!files || files.length === 0)) return;
    
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message, files }]);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "That's a great point. Can you elaborate more on how you handled the challenges during that project?",
        }
      ]);
      // Scroll to bottom after AI responds
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 1500);

    // Scroll to bottom after user sends
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-200 flex flex-col pt-16">
      
      {/* Job Role Popup */}
      <AnimatePresence>
        {!jobRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#1F2023] border border-[#333333] p-6 rounded-2xl shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-2">Welcome to AI Interview Practice</h2>
              <p className="text-sm text-slate-400 mb-6">
                Please enter the job role you are targeting to tailor the interview questions.
              </p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-[#111111] border border-[#333333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStartSession()}
                />
                <button
                  onClick={handleStartSession}
                  disabled={!roleInput.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Start Practice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area - Unbounded natural flow */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col pb-40 px-4 md:px-8 mt-8">
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "ai" 
                    ? "bg-purple-500/20 border border-purple-500/30 text-purple-400" 
                    : "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                }`}>
                  {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm"
                    : "bg-blue-500/10 border border-blue-500/20 text-white rounded-tr-sm"
                }`}>
                  {msg.content}
                  
                  {/* File previews in chat if uploaded */}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.files.map((file, i) => (
                        <div key={i} className="px-3 py-1.5 bg-black/30 rounded-lg text-xs text-slate-300 flex items-center gap-2">
                          <span className="truncate max-w-[150px]">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Prompt Input Box at bottom */}
      {jobRole && (
        <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent z-20 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <PromptInputBox 
              onSend={handleSendMessage} 
              placeholder="Use voice to practice speaking..."
            />
          </div>
        </div>
      )}

    </div>
  );
}
