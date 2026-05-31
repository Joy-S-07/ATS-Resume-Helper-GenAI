"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic, MicOff, Bot, User as UserIcon, Loader2,
  AlertCircle, ChevronDown, Check, Star, TrendingUp,
  TrendingDown, Award, RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnomalousMatterBackground } from "@/components/ui/anomalous-matter-hero";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "setup" | "interview" | "feedback";
type MicState = "idle" | "listening" | "ai-speaking" | "processing";

interface Message { id: string; role: "user" | "ai"; content: string; }
interface Feedback {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  questionScores: { question: string; score: number; feedback: string }[];
  recommendation: "Hire" | "Consider" | "Pass";
}

const SENIORITY_LEVELS = ["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Principal"];
const FOCUS_AREAS = ["Behavioral", "Technical", "System Design", "Case Study", "Mixed"];

// ─── TTS via ElevenLabs (server-side proxy) ───────────────────────────────────
async function speakWithElevenLabs(text: string): Promise<void> {
  const res = await fetch("/api/interview/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("TTS request failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    audio.play().catch(reject);
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIInterviewPage() {
  const [isClient, setIsClient] = useState(false);
  const [phase, setPhase] = useState<Phase>("setup");

  // Setup
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [seniority, setSeniority] = useState(SENIORITY_LEVELS[2]);
  const [focus, setFocus] = useState(FOCUS_AREAS[4]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  // Interview
  const [messages, setMessages] = useState<Message[]>([]);
  const [micState, setMicState] = useState<MicState>("idle");
  const [interimText, setInterimText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [ttsError, setTtsError] = useState(false); // fallback flag

  // Feedback
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        recognitionRef.current = new SR();
        // continuous and interimResults are set in startListening
      }
    }
    return () => { recognitionRef.current?.abort(); };
  }, []);

  useEffect(() => {
    if (phase === "interview") messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, phase]);

  // ── Speak helper: ElevenLabs → browser TTS fallback ──────────────────────
  const speak = useCallback(async (text: string, onDone?: () => void) => {
    setMicState("ai-speaking");
    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    try {
      if (!ttsError) {
        await speakWithElevenLabs(text);
      } else {
        throw new Error("TTS disabled");
      }
    } catch {
      // Fallback to browser TTS
      setTtsError(true);
      await new Promise<void>((resolve) => {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.onend = () => resolve();
        utt.onerror = () => resolve();
        synth.speak(utt);
      });
    }
    setMicState("idle");
    onDone?.();
  }, [ttsError]);

  // ── Add AI message + speak it ─────────────────────────────────────────────
  const addAiMessage = useCallback((text: string, onDone?: () => void) => {
    const msg: Message = { id: Date.now().toString(), role: "ai", content: text };
    setMessages((prev) => [...prev, msg]);
    speak(text, onDone);
  }, [speak]);

  // ── Start interview: fetch questions, greet ───────────────────────────────
  const handleStartInterview = async () => {
    if (!jobTitle.trim()) { setSetupError("Job Title is required."); return; }
    setSetupError("");
    setIsStarting(true);
    try {
      const res = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, company, seniority, focus, count: 8 }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load questions");
      const qs: string[] = data.questions || [];
      setQuestions(qs);
      setCurrentQIdx(0);
      setPhase("interview");

      const greeting = `Hello! I'm your AI interviewer. We'll be doing a ${focus.toLowerCase()} interview for the ${seniority} ${jobTitle}${company ? ` at ${company}` : ""} role. Let's begin. ${qs[0] || "Tell me about yourself."}`;
      setMessages([]);
      setTimeout(() => addAiMessage(greeting), 300);
    } catch (err: any) {
      setSetupError(err.message || "Failed to start interview");
    } finally {
      setIsStarting(false);
    }
  };

  // ── Handle user answer → get AI response ─────────────────────────────────
  const handleUserAnswer = useCallback(async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    // Add user message first, then fire AI call
    setMessages((prev) => [...prev, userMsg]);
    setMicState("processing");

    try {
      // Build history snapshot synchronously from current messages + new user msg
      const historySnapshot = [...messages, userMsg];
      const res = await fetch("/api/interview/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle, company, seniority, focus,
          history: historySnapshot,
          userAnswer: text,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCurrentQIdx((i) => i + 1);
      addAiMessage(data.text);
    } catch {
      addAiMessage("I'm having trouble connecting. Could you repeat that?");
    }
  }, [jobTitle, company, seniority, focus, messages, currentQIdx, addAiMessage]);

  // ── Mic controls ──────────────────────────────────────────────────────────
  // Track whether we intentionally stopped (to avoid onend resetting state)
  const intentionalStopRef = useRef(false);
  // Accumulate final transcript across multiple recognition results
  const finalTranscriptRef = useRef("");

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported. Please use Chrome or Edge.");
      return;
    }
    // Interrupt AI if speaking
    if (micState === "ai-speaking") {
      window.speechSynthesis?.cancel();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    }

    intentionalStopRef.current = false;
    finalTranscriptRef.current = "";
    setMicState("listening");
    setInterimText("");

    // continuous = true keeps listening across pauses
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscriptRef.current += e.results[i][0].transcript + " ";
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      // Show accumulated final + current interim
      setInterimText((finalTranscriptRef.current + interim).trim());
    };

    recognitionRef.current.onerror = (e: any) => {
      // Recoverable errors — reset transcript state, abort and restart after a short delay
      if (e.error === "no-speech" || e.error === "network") {
        finalTranscriptRef.current = "";
        setInterimText("");
        try {
          recognitionRef.current?.abort();
          setTimeout(() => {
            if (!intentionalStopRef.current) {
              recognitionRef.current?.start();
            }
          }, 300);
        } catch {}
        return;
      }
      // Unrecoverable errors — stop mic
      console.warn("Speech recognition error:", e.error);
      setMicState("idle");
      setInterimText("");
    };

    recognitionRef.current.onend = () => {
      // Intentional stop — stopAndSubmit handles the state
      if (intentionalStopRef.current) return;

      // Unintentional end — restart after a short delay to keep listening
      setTimeout(() => {
        if (!intentionalStopRef.current) {
          try {
            recognitionRef.current?.start();
          } catch {
            // Already started — ignore
          }
        }
      }, 300);
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already started — ignore
    }
  }, [micState]);

  const stopAndSubmit = useCallback(() => {
    intentionalStopRef.current = true;
    recognitionRef.current?.stop();

    // Use accumulated final transcript, fall back to whatever is shown as interim
    const text = (finalTranscriptRef.current || interimText).trim();
    finalTranscriptRef.current = "";
    setInterimText("");

    if (text && text.length > 2) {
      handleUserAnswer(text);
    } else {
      // Nothing was captured — ask user to repeat
      setMicState("idle");
      setInterimText("");
      addAiMessage("I'm sorry, I couldn't hear that clearly. Could you please repeat your answer?");
    }
  }, [interimText, handleUserAnswer, addAiMessage]);

  const handleMicClick = () => {
    if (micState === "processing") return;
    if (micState === "listening") stopAndSubmit();
    else startListening();
  };

  // ── End interview → fetch feedback ────────────────────────────────────────
  const handleEndInterview = async () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setIsFetchingFeedback(true);
    setPhase("feedback");
    try {
      const res = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, seniority, focus, history: messages }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setFeedback(data.feedback);
    } catch {}
    setIsFetchingFeedback(false);
  };

  const handleRestart = () => {
    setPhase("setup"); setMessages([]); setFeedback(null);
    setMicState("idle"); setInterimText(""); setCurrentQIdx(0); setQuestions([]);
  };

  if (!isClient) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full text-slate-200 font-sans overflow-hidden">
      <AnomalousMatterBackground />
      <AnimatePresence mode="wait">

        {/* ── PHASE 1: Setup ── */}
        {phase === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl relative z-10">
              <div className="glass-card w-full !overflow-visible">
                <div className="absolute inset-0 bg-[#050505]/70 rounded-[20px] z-0" />
                <div className="p-8 md:p-12 relative z-10">
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      <span className="text-xs font-mono text-slate-300 uppercase tracking-wider">AI Interviewer Ready</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-3">
                      Configure Interview
                    </h1>
                    <p className="text-slate-400 text-sm max-w-md">
                      Questions are generated by AI for your exact role. Voice responses powered by ElevenLabs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Job Title *</label>
                      <input type="text" placeholder="e.g. Frontend Engineer" value={jobTitle}
                        onChange={(e) => { setJobTitle(e.target.value); if (e.target.value.trim()) setSetupError(""); }}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Company (Optional)</label>
                      <input type="text" placeholder="e.g. Google" value={company} onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all" />
                    </div>

                    <div className="space-y-2 md:col-span-2 relative">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Seniority Level</label>
                      <div className="relative">
                        <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-all">
                          <span>{seniority}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                              className="absolute z-50 w-full mt-2 py-2 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
                              {SENIORITY_LEVELS.map(l => (
                                <button key={l} type="button" onClick={() => { setSeniority(l); setIsDropdownOpen(false); }}
                                  className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                                  <span>{l}</span>
                                  {seniority === l && <Check className="w-4 h-4 text-white" />}
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
                          <button key={area} onClick={() => setFocus(area)}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all border border-transparent ${focus === area ? "text-black" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"}`}>
                            {focus === area && <motion.div layoutId="focus-pill" className="absolute inset-0 bg-white rounded-full z-0" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
                            <span className="relative z-10">{area}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {setupError && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="mb-6 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 shrink-0" /><span>{setupError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button onClick={handleStartInterview} disabled={isStarting}
                    className="w-full mt-6 py-3.5 px-4 bg-white/90 text-black font-medium rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {isStarting ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating questions...</> : <>Start Voice Interview <span>→</span></>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PHASE 2: Interview ── */}
        {phase === "interview" && (
          <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col">

            {/* Top bar */}
            <div className="shrink-0 border-b border-white/5 bg-black/20 backdrop-blur-md px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-slate-200" />
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#050505] ${micState === "ai-speaking" ? "bg-green-500 animate-pulse" : "bg-slate-500"}`} />
                </div>
                <div>
                  <h2 className="text-white font-medium flex items-center gap-2">
                    AI Interviewer
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300 uppercase">Live</span>
                    {ttsError && <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/20 text-yellow-400">Browser TTS</span>}
                  </h2>
                  <p className="text-xs text-slate-400">{seniority} {jobTitle}{company ? ` • ${company}` : ""} • {focus}</p>
                </div>
              </div>
              <button onClick={handleEndInterview}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all text-sm font-medium text-slate-300">
                End &amp; Get Feedback
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
              <div className="max-w-4xl mx-auto space-y-6 pb-48">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai" ? "bg-white/10 border border-white/20 text-white" : "bg-slate-800 border border-white/10 text-slate-400"}`}>
                        {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl text-[15px] leading-relaxed ${msg.role === "ai" ? "bg-white/[0.03] border border-white/5 text-slate-200 rounded-tl-sm" : "bg-slate-800/50 border border-white/10 text-slate-100 rounded-tr-sm"}`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {interimText && (
                    <motion.div key="interim" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse opacity-60">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="p-4 rounded-2xl text-[15px] bg-slate-800/30 border border-white/10 text-slate-300 italic rounded-tr-sm">
                        {interimText}...
                      </div>
                    </motion.div>
                  )}

                  {micState === "processing" && (
                    <motion.div key="thinking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex gap-4 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-1.5 h-[52px]">
                        {[0, 150, 300].map((d) => (
                          <span key={d} className="w-2 h-2 rounded-full bg-slate-400/50 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom mic bar */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-30 flex flex-col items-center gap-4">
              <div className="px-5 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md max-w-lg text-center">
                {micState === "listening" ? (
                  <span className="text-sm font-mono text-red-400 flex items-center gap-2 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Listening... (tap to submit)
                  </span>
                ) : micState === "ai-speaking" ? (
                  <span className="text-sm font-mono text-green-400">AI speaking... (tap mic to interrupt)</span>
                ) : micState === "processing" ? (
                  <span className="text-sm font-mono text-slate-400">Processing your answer...</span>
                ) : interimText ? (
                  <span className="text-sm font-mono text-slate-300 truncate">{interimText}</span>
                ) : (
                  <span className="text-sm font-mono text-slate-500">Tap mic to speak your answer</span>
                )}
              </div>

              <button onClick={handleMicClick} disabled={micState === "processing"}
                className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all ${
                  micState === "listening"
                    ? "bg-white border-white shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    : micState === "ai-speaking"
                    ? "bg-green-500/20 border-green-500/50"
                    : "bg-white/5 border-white/20 hover:bg-white/10"
                } disabled:opacity-40 disabled:cursor-not-allowed`}>
                {micState === "listening"
                  ? <MicOff className="w-9 h-9 text-black" />
                  : <Mic className={`w-9 h-9 ${micState === "ai-speaking" ? "text-green-400" : "text-white"}`} />}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PHASE 3: Feedback ── */}
        {phase === "feedback" && (
          <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 overflow-y-auto px-4 py-12">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Interview Complete</h1>
                <p className="text-slate-400">{seniority} {jobTitle}{company ? ` at ${company}` : ""} • {focus}</p>
              </div>

              {isFetchingFeedback ? (
                <div className="flex flex-col items-center gap-4 py-20">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                  <p className="text-slate-400">Analysing your interview...</p>
                </div>
              ) : feedback ? (
                <>
                  {/* Score card */}
                  <div className="glass-card p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#050505]/60 rounded-[20px]" />
                    <div className="relative z-10">
                      <div className={`text-7xl font-black mb-2 ${feedback.overallScore >= 75 ? "text-green-400" : feedback.overallScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                        {feedback.overallScore}
                      </div>
                      <p className="text-slate-400 text-sm mb-4">out of 100</p>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                        feedback.recommendation === "Hire" ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : feedback.recommendation === "Consider" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        {feedback.recommendation === "Hire" ? "✓ Recommend Hire" : feedback.recommendation === "Consider" ? "~ Consider" : "✗ Pass"}
                      </span>
                      <p className="text-slate-300 mt-4 text-sm leading-relaxed max-w-xl mx-auto">{feedback.summary}</p>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#050505]/60 rounded-[20px]" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                          <h3 className="font-semibold text-white">Strengths</h3>
                        </div>
                        <ul className="space-y-2">
                          {feedback.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="text-green-400 mt-0.5">✓</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="glass-card p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#050505]/60 rounded-[20px]" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingDown className="w-5 h-5 text-yellow-400" />
                          <h3 className="font-semibold text-white">Areas to Improve</h3>
                        </div>
                        <ul className="space-y-2">
                          {feedback.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="text-yellow-400 mt-0.5">→</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Per-question scores */}
                  {feedback.questionScores?.length > 0 && (
                    <div className="glass-card p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#050505]/60 rounded-[20px]" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="w-5 h-5 text-slate-300" />
                          <h3 className="font-semibold text-white">Question Breakdown</h3>
                        </div>
                        <div className="space-y-4">
                          {feedback.questionScores.map((q, i) => (
                            <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                              <div className="flex items-start justify-between gap-4 mb-1">
                                <p className="text-sm text-slate-300 flex-1">{q.question}</p>
                                <span className={`text-sm font-bold shrink-0 ${q.score >= 75 ? "text-green-400" : q.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>{q.score}/100</span>
                              </div>
                              <p className="text-xs text-slate-500">{q.feedback}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p>Could not generate feedback. The interview may have been too short.</p>
                </div>
              )}

              <button onClick={handleRestart}
                className="w-full py-3.5 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Start New Interview
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
