"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Square, Bot, User as UserIcon, Loader2, AlertCircle, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnomalousMatterBackground } from "@/components/ui/anomalous-matter-hero";

// --- Types & Constants ---
type Phase = 1 | 2;
type MicState = "idle" | "listening" | "ai-speaking" | "disabled";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const SENIORITY_LEVELS = ["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Principal"];
const FOCUS_AREAS = ["Behavioral", "Technical", "System Design", "Case Study", "Mixed"];

// --- Helper for Mock AI Responses ---
const MOCK_RESPONSES = [
  "That's a great point. Can you elaborate more on how you handled the specific challenges during that project?",
  "Interesting approach. How would you scale that solution if the traffic increased tenfold?",
  "I see. Tell me about a time when you disagreed with a team member about a technical decision. How did you resolve it?",
  "Could you walk me through the architecture of the most complex system you've designed?",
  "That makes sense. What were the key metrics you used to measure the success of that initiative?",
];

const getRandomResponse = () => MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

// --- Main Component ---
export default function AIInterviewPage() {
  const [isClient, setIsClient] = useState(false);
  const [phase, setPhase] = useState<Phase>(1);

  // Setup State
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [seniority, setSeniority] = useState(SENIORITY_LEVELS[2]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focus, setFocus] = useState(FOCUS_AREAS[0]);
  const [setupError, setSetupError] = useState("");

  // Chat & Voice State
  const [messages, setMessages] = useState<Message[]>([]);
  const [micState, setMicState] = useState<MicState>("idle");
  const [interimText, setInterimText] = useState("");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Client & Speech
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
      }
    }

    return () => {
      if (synthesisRef.current) synthesisRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (phase === 2 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, phase, interimText]);

  // --- Voice Logic ---
  const startRecording = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // Interruption mechanic
    if (micState === "ai-speaking" && synthesisRef.current) {
      synthesisRef.current.cancel();
    }

    setMicState("listening");
    setInterimText("");

    recognitionRef.current.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimText(interim || final);
    };

    recognitionRef.current.onend = () => {
      setMicState((prev) => (prev === "listening" ? "idle" : prev));
      // In a real app, you might want to wait for a pause before submitting, 
      // but for this demo, we'll submit when recognition naturally ends if there's text.
      // We rely on the interimText state to grab the final result before clearing.
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Recognition already started or error:", e);
    }
  }, [micState]);

  const stopRecordingAndSubmit = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (interimText.trim()) {
      handleUserMessage(interimText.trim());
      setInterimText("");
    } else {
      setMicState("idle");
    }
  }, [interimText]);

  const handleMicClick = () => {
    if (micState === "disabled") return;

    if (micState === "listening") {
      stopRecordingAndSubmit();
    } else {
      startRecording();
    }
  };

  const speak = (text: string) => {
    if (!synthesisRef.current) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => setMicState("ai-speaking");
    utterance.onend = () => setMicState("idle");
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error", e);
      setMicState("idle");
    };

    synthesisRef.current.speak(utterance);
  };

  const handleUserMessage = (text: string) => {
    const newMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);
    setMicState("disabled"); // Disable mic while AI thinks

    // Mock API Call
    setTimeout(() => {
      const responseText = getRandomResponse();
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: responseText };
      setMessages((prev) => [...prev, aiMsg]);
      speak(responseText);
    }, 1500);
  };

  // --- Handlers ---
  const handleStartInterview = () => {
    if (!jobTitle.trim()) {
      setSetupError("Job Title is required to start the interview.");
      return;
    }
    setSetupError("");
    setPhase(2);

    // Initial AI greeting
    const greeting = `Hello! I'm your AI Interviewer. We'll be doing a ${focus.toLowerCase()} interview for the ${seniority} ${jobTitle} role${company ? ` at ${company}` : ''}. Whenever you're ready, just tap the microphone and say hello.`;
    setMessages([{ id: "init", role: "ai", content: greeting }]);

    setTimeout(() => {
      speak(greeting);
    }, 500);
  };

  const handleEndInterview = () => {
    if (synthesisRef.current) synthesisRef.current.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();
    setPhase(1);
    setMessages([]);
    setMicState("idle");
    setInterimText("");
  };

  if (!isClient) return null;

  return (
    <div className="relative min-h-screen w-full text-slate-200 font-sans overflow-hidden">
      <AnomalousMatterBackground />

      <AnimatePresence mode="wait">
        {phase === 1 ? (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="absolute inset-0 z-10 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl relative z-10">
              <div className="glass-card w-full !overflow-visible">
                <div className="absolute inset-0 bg-[#050505]/70 rounded-[20px] z-0" />
                <div className="p-8 md:p-12 relative z-10">

                  {/* Header */}
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </div>
                      <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">System Ready</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-3">
                      Configure Interview
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-md">
                      Set the parameters for your AI mock interview. The persona will adapt to your specified role and focus area.
                    </p>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Job Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Frontend Engineer"
                        value={jobTitle}
                        onChange={(e) => {
                          setJobTitle(e.target.value);
                          if (e.target.value.trim()) setSetupError("");
                        }}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Company (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 relative">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Seniority Level</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all backdrop-blur-sm"
                        >
                          <span>{seniority}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute z-50 w-full mt-2 py-2 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                            >
                              {SENIORITY_LEVELS.map(level => (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => {
                                    setSeniority(level);
                                    setIsDropdownOpen(false);
                                  }}
                                  className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  <span>{level}</span>
                                  {seniority === level && <Check className="w-4 h-4 text-white" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Interview Focus</label>
                      <div className="flex flex-wrap gap-2">
                        {FOCUS_AREAS.map(area => (
                          <button
                            key={area}
                            onClick={() => setFocus(area)}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent ${focus === area
                                ? "text-black"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                              }`}
                          >
                            {focus === area && (
                              <motion.div
                                layoutId="focus-pill"
                                className="absolute inset-0 bg-white rounded-full z-0 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                              />
                            )}
                            <span className="relative z-10">{area}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Error Slot */}
                  <AnimatePresence>
                    {setupError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{setupError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action */}
                  <button
                    onClick={handleStartInterview}
                    className="w-full mt-6 py-3.5 px-4 bg-white/90 text-black font-medium rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all flex items-center justify-center group"
                  >
                    Start Voice Interview
                    <span className="group-hover:translate-x-1 transition-transform duration-300 ml-2">→</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="phase2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col"
          >
            {/* Top Navigation Bar */}
            <div className="shrink-0 border-b border-white/5 bg-black/20 backdrop-blur-md px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-slate-200" />
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#050505] ${micState === "ai-speaking" ? "bg-green-500 animate-pulse" : "bg-slate-500"
                    }`}></span>
                </div>
                <div>
                  <h2 className="text-white font-medium flex items-center gap-2">
                    AI Interviewer
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300 uppercase">Live</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {seniority} {jobTitle} {company ? `• ${company}` : ""} • {focus}
                  </p>
                </div>
              </div>

              <button
                onClick={handleEndInterview}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all text-sm font-medium text-slate-300"
              >
                End Session
              </button>
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scroll-smooth">
              <div className="max-w-4xl mx-auto space-y-8 pb-32">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai"
                          ? "bg-white/10 border border-white/20 text-white"
                          : "bg-slate-800 border border-white/10 text-slate-400"
                        }`}>
                        {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                      </div>

                      <div className={`p-4 md:p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === "ai"
                          ? "bg-white/[0.03] border border-white/5 text-slate-200 rounded-tl-sm backdrop-blur-sm"
                          : "bg-slate-800/50 border border-white/10 text-slate-100 rounded-tr-sm"
                        }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {/* Interim Text Display */}
                  {interimText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse opacity-60"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 text-slate-400 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div className="p-4 rounded-2xl text-[15px] leading-relaxed bg-slate-800/30 border border-white/10 text-slate-300 rounded-tr-sm italic">
                        {interimText}...
                      </div>
                    </motion.div>
                  )}

                  {/* Loading State for AI */}
                  {micState === "disabled" && !interimText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4 max-w-[85%]"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                        <span className="w-2 h-2 rounded-full bg-slate-400/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>

            {/* Bottom Control Bar */}
            <div className="fixed bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-30 flex flex-col items-center safe-area-bottom">

              {/* Dynamic Live Transcript Pill */}
              <div className="h-8 mb-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={micState + (interimText ? "text" : "empty")}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-4 py-1.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-lg max-w-lg truncate"
                  >
                    {interimText ? (
                      <span className="text-sm font-mono text-slate-300">{interimText}</span>
                    ) : micState === "listening" ? (
                      <span className="text-sm font-mono text-red-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Listening...
                      </span>
                    ) : micState === "ai-speaking" ? (
                      <span className="text-sm font-mono text-green-400">AI is speaking... (Tap mic to interrupt)</span>
                    ) : micState === "disabled" ? (
                      <span className="text-sm font-mono text-slate-400">Processing...</span>
                    ) : (
                      <span className="text-sm font-mono text-slate-500">Tap mic to speak</span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Waveform & Mic Container */}
              <div className="relative flex items-center justify-center w-full max-w-2xl h-32">

                {/* Left Waveform */}
                <div className="absolute left-0 right-1/2 flex items-center justify-end gap-[3px] pr-16 opacity-70">
                  <Waveform active={micState === "listening" || micState === "ai-speaking"} mode={micState} align="right" />
                </div>

                {/* Center Mic Button */}
                <MicButton micState={micState} onClick={handleMicClick} />

                {/* Right Waveform */}
                <div className="absolute left-1/2 right-0 flex items-center justify-start gap-[3px] pl-16 opacity-70">
                  <Waveform active={micState === "listening" || micState === "ai-speaking"} mode={micState} align="left" />
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Required Keyframes for Mic Button */}
      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes rippleOut {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// --- Mic Button Component ---
function MicButton({ micState, onClick }: { micState: MicState; onClick: () => void }) {
  const [ripple, setRipple] = useState(false);

  const handleTap = () => {
    if (micState === "disabled") return;
    setRipple(false);
    setTimeout(() => setRipple(true), 10);
    onClick();
  };

  const isRecording = micState === "listening";
  const isPaused = micState === "ai-speaking" || micState === "disabled";

  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      {/* Ripple */}
      {ripple && (
        <span
          key={String(ripple)}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.5)",
            animation: "rippleOut 0.55s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Pulse ring for recording */}
      {isRecording && (
        <>
          <span
            style={{
              position: "absolute",
              inset: "-14px",
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.12)",
              animation: "pulseRing 1.8s ease-out infinite",
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: "-28px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.06)",
              animation: "pulseRing 1.8s ease-out 0.4s infinite",
            }}
          />
        </>
      )}

      {/* Main button */}
      <button
        onClick={handleTap}
        disabled={micState === "disabled"}
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "50%",
          background: isRecording
            ? "#fff"
            : isPaused
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.06)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          cursor: micState === "disabled" ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.25s ease, transform 0.1s ease",
          outline: "none",
          position: "relative",
          boxShadow: isRecording ? "0 0 40px rgba(255,255,255,0.2)" : "none",
        }}
        onMouseDown={(e) => {
          if (micState !== "disabled") e.currentTarget.style.transform = "scale(0.94)";
        }}
        onMouseUp={(e) => {
          if (micState !== "disabled") e.currentTarget.style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          if (micState !== "disabled") e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {isRecording ? (
          /* Pause icon */
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="7" width="5" height="18" rx="2" fill="#000" />
            <rect x="19" y="7" width="5" height="18" rx="2" fill="#000" />
          </svg>
        ) : (
          /* Mic icon */
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="13" y="3" width="12" height="18" rx="6" fill={isPaused ? "rgba(255,255,255,0.7)" : "#fff"} />
            <path d="M8 18C8 24.627 13.373 30 20 30" stroke={isPaused ? "rgba(255,255,255,0.7)" : "#fff"} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M32 18C32 24.627 26.627 30 20 30" stroke={isPaused ? "rgba(255,255,255,0.7)" : "#fff"} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <line x1="20" y1="30" x2="20" y2="36" stroke={isPaused ? "rgba(255,255,255,0.7)" : "#fff"} strokeWidth="2.2" strokeLinecap="round" />
            <line x1="14" y1="36" x2="26" y2="36" stroke={isPaused ? "rgba(255,255,255,0.7)" : "#fff"} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

// --- Waveform Component ---
interface WaveBar {
  id: number;
  height: number;
  targetHeight: number;
}

function Waveform({ active, mode, align }: { active: boolean; mode: MicState; align: "left" | "right" }) {
  const barCount = 14;
  const [bars, setBars] = useState<WaveBar[]>(
    Array.from({ length: barCount }, (_, i) => ({ id: i, height: 4, targetHeight: 4 }))
  );
  const animFrameRef = useRef<number | null>(null);

  const animateBars = useCallback(() => {
    setBars((prev) =>
      prev.map((bar) => {
        const diff = bar.targetHeight - bar.height;
        const newHeight = bar.height + diff * 0.18;
        const newTarget =
          Math.abs(diff) < 0.5 ? Math.random() * 36 + 4 : bar.targetHeight;
        return { ...bar, height: newHeight, targetHeight: newTarget };
      })
    );
    animFrameRef.current = requestAnimationFrame(animateBars);
  }, []);

  const flattenBars = useCallback(() => {
    setBars((prev) => prev.map((bar) => ({ ...bar, height: 4, targetHeight: 4 })));
  }, []);

  useEffect(() => {
    if (active) {
      animFrameRef.current = requestAnimationFrame(animateBars);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      flattenBars();
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, animateBars, flattenBars]);

  // If align is left, we just map them directly. 
  // We can just rely on flex layout gap and order.
  const displayBars = align === "left" ? bars : [...bars].reverse();

  return (
    <>
      {displayBars.map((bar) => (
        <div
          key={bar.id}
          style={{
            width: "3px",
            height: `${bar.height}px`,
            background: mode === "listening" ? "#fff" : "rgba(255,255,255,0.45)",
            borderRadius: "2px",
            transition: !active ? "height 0.3s ease" : "none",
          }}
        />
      ))}
    </>
  );
}
