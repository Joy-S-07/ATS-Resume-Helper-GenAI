"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  LayoutTemplate,
  Briefcase,
  TrendingUp,
  Target,
  FileSearch,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GLSLHills } from "@/components/ui/glsl-hills";

// ─── Types matching the backend model ────────────────────────────────────────
interface ATSResult {
  _id: string;
  fileName: string;
  jobRole: string;
  score: number;
  verdict: string;
  summary: string;
  metrics: { count: number; examples: string[] };
  actionVerbs: { strong: string[]; weak: string[] };
  keywords: {
    matched: { keyword: string; found: boolean }[];
    missing: { keyword: string; found: boolean }[];
  };
  formattingIssues: { type: "error" | "warning" | "pass"; message: string }[];
  sections: { name: string; present: boolean }[];
  recommendations: string[];
}

const ATSScoreChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "complete">("idle");
  const [score, setScore] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  // Bug 1 fix: direct ref to the hidden file input so the Browse button can trigger it
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref to track current status inside async closures (avoids stale state)
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    gsap.fromTo(
      ".ats-stagger",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const animateScore = (targetScore: number) => {
    const obj = { value: 0 };
    gsap.to(obj, {
      value: targetScore,
      duration: 2,
      ease: "power4.out",
      onUpdate: () => setScore(Math.round(obj.value)),
    });
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStatus("uploading");
    setUploadProgress(0);

    // Animate upload bar to 90% while the real request is in-flight
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress = Math.min(progress + 4, 90);
      setUploadProgress(progress);
      if (progress >= 90) clearInterval(uploadInterval);
    }, 80);

    // Bug 2 fix: track whether fetch resolved before the transition timer fires
    let fetchDone = false;
    let pendingResult: ATSResult | null = null;
    let pendingError: string | null = null;

    // After 1.8 s of fake upload, switch to the analyzing skeleton —
    // but only if the real fetch hasn't already finished
    const transitionTimer = setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      setTimeout(() => {
        if (!fetchDone) {
          // fetch still running — show skeleton
          setStatus("analyzing");
        } else if (pendingError) {
          setError(pendingError);
          setStatus("idle");
        } else if (pendingResult) {
          setResult(pendingResult);
          setStatus("complete");
          animateScore(pendingResult.score);
        }
      }, 400);
    }, 1800);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("jobRole", jobRole);

      const response = await fetch("/api/ats", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      fetchDone = true;

      if (!response.ok) {
        pendingError = data.error || "Analysis failed. Please try again.";
        // If the skeleton is already showing, go straight to idle+error
        if (statusRef.current === "analyzing") {
          setError(pendingError);
          setStatus("idle");
        }
        // Otherwise the transitionTimer callback will handle it
        return;
      }

      pendingResult = data.result;
      // If the skeleton is already showing, go straight to complete
      if (statusRef.current === "analyzing") {
        setResult(data.result);
        setStatus("complete");
        animateScore(data.result.score);
      }
      // Otherwise the transitionTimer callback will handle it
    } catch {
      fetchDone = true;
      pendingError = "Network error. Make sure the server is running on port 3000.";
      clearTimeout(transitionTimer);
      clearInterval(uploadInterval);
      setError(pendingError);
      setStatus("idle");
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 76) return "text-emerald-400 stroke-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]";
    if (s >= 51) return "text-amber-400 stroke-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    return "text-red-400 stroke-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]";
  };

  const getScoreBgColor = (s: number) => {
    if (s >= 76) return "bg-emerald-500/10";
    if (s >= 51) return "bg-amber-500/10";
    return "bg-red-500/10";
  };

  const toggleSection = (section: string) =>
    setExpandedSection(expandedSection === section ? null : section);

  const handleReset = () => {
    setStatus("idle");
    setScore(0);
    setResult(null);
    setFile(null);
    setError(null);
    setJobRole("");
  };


  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden min-h-[calc(100vh-64px)] rounded-3xl">
      <motion.div
        animate={{ opacity: status !== "idle" ? 0.3 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl"
      >
        <GLSLHills className="w-full h-full" width="100%" height="100%" />
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col justify-center h-full py-12 px-4 md:px-8">
        <AnimatePresence mode="wait">

          {/* ── 1. IDLE ─────────────────────────────────────────────────── */}
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="ats-stagger flex flex-col justify-center gap-8 bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              {/* Error banner */}
              {error && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="w-full">
                <label className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-2 block ml-1">
                  Target Job Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-96 rounded-3xl border-2 border-dashed transition-all overflow-hidden bg-[#111]/50 backdrop-blur-sm",
                  jobRole.trim().length > 0
                    ? "border-slate-600 hover:border-emerald-400/50 hover:bg-emerald-400/5 cursor-pointer"
                    : "border-slate-700/50 cursor-not-allowed opacity-50"
                )}
                onClick={() => jobRole.trim().length > 0 && fileInputRef.current?.click()}
              >
                {/* Hidden real file input — triggered by ref */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-upload"
                  onChange={handleFileChange}
                  disabled={jobRole.trim().length === 0}
                />
                <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center pointer-events-none">
                  <div className="flex gap-4 mb-8">
                    <div className="relative flex items-center justify-center bg-red-500/10 text-red-400 p-4 rounded-2xl transform -rotate-6 shadow-lg border border-red-500/20">
                      <FileText className="w-10 h-10" />
                      <span className="absolute -bottom-2 -right-2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded shadow-sm">PDF</span>
                    </div>
                    <div className="relative flex items-center justify-center bg-blue-500/10 text-blue-400 p-4 rounded-2xl transform rotate-6 shadow-lg border border-blue-500/20">
                      <FileText className="w-10 h-10" />
                      <span className="absolute -bottom-2 -right-2 text-[10px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded shadow-sm">DOC</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">Drag & Drop Resume</p>
                  <p className="text-base text-slate-400 mb-8">Supports PDF, DOCX (Max 5MB)</p>
                  {/* Bug 1 fix: pointer-events-auto so the button itself is clickable,
                      but it calls fileInputRef.current.click() directly */}
                  <button
                    type="button"
                    disabled={jobRole.trim().length === 0}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="pointer-events-auto border border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-3 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Browse Files
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 2. UPLOADING ────────────────────────────────────────────── */}
          {status === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center h-96"
            >
              <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-emerald-500/20 blur-[80px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Uploading &ldquo;{file?.name}&rdquo;
                  </h3>
                  <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{uploadProgress}% Uploaded</span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Uploading Resume</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 3. ANALYZING ────────────────────────────────────────────── */}
          {status === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col border border-white/10 rounded-2xl bg-[#111]/60 backdrop-blur-md overflow-hidden shadow-xl"
            >
              <div className="flex items-center gap-8 p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="w-28 h-28 rounded-full bg-white/5 animate-pulse shrink-0" />
                <div className="space-y-4 w-full max-w-lg">
                  <div className="h-10 bg-white/5 rounded-lg w-1/2 animate-pulse" />
                  <div className="h-5 bg-white/5 rounded-md w-full animate-pulse" />
                  <div className="h-5 bg-white/5 rounded-md w-3/4 animate-pulse" />
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border border-white/5 rounded-xl bg-white/[0.02] p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                      <div className="h-6 bg-white/5 rounded-md w-1/3 animate-pulse" />
                    </div>
                    <div className="space-y-3 mt-2">
                      <div className="h-4 bg-white/5 rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-md w-4/5 animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-md w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 pb-8 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                <span className="text-sm font-medium animate-pulse">AI is analysing your resume…</span>
              </div>
            </motion.div>
          )}

          {/* ── 4. COMPLETE ─────────────────────────────────────────────── */}
          {status === "complete" && result && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col border border-white/10 rounded-2xl bg-[#111]/60 backdrop-blur-md overflow-hidden shadow-xl"
            >
              {/* Score header */}
              <div className={cn("flex flex-col md:flex-row items-center gap-8 p-8 border-b border-white/5", getScoreBgColor(score))}>
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-800" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      className={getScoreColor(score)}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * score) / 100}
                      style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={cn("text-5xl font-black tabular-nums", getScoreColor(score).split(" ")[0])}>
                      {score}
                    </span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-black text-white mb-3">{result.verdict}</h3>
                  <p className="text-lg text-slate-300 max-w-2xl">{result.summary}</p>
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    <Button variant="outline" onClick={handleReset} className="border-white/20 text-white hover:bg-white/10 rounded-full px-6 transition-colors">
                      Scan Another Resume
                    </Button>
                  </div>
                </div>
              </div>

              {/* Detail cards */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0a0a]/50">

                {/* Quantifiable Metrics */}
                <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
                  <button onClick={() => toggleSection("metrics")} className="w-full flex items-center justify-between p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-lg text-slate-200">
                        Quantifiable Metrics ({result.metrics.count})
                      </span>
                    </div>
                    {expandedSection === "metrics" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "metrics" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5 pt-0 border-t border-white/5 text-base text-slate-400 space-y-3">
                          <p>Found <strong className="text-white">{result.metrics.count} metric{result.metrics.count !== 1 ? "s" : ""}</strong> backing up your achievements.</p>
                          {result.metrics.examples.length > 0 && (
                            <ul className="list-disc pl-5 space-y-1">
                              {result.metrics.examples.map((ex, i) => (
                                <li key={i}>&ldquo;{ex}&rdquo; <CheckCircle className="inline w-3 h-3 text-emerald-400 ml-1" /></li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Verbs */}
                <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
                  <button onClick={() => toggleSection("verbs")} className="w-full flex items-center justify-between p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Target className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-lg text-slate-200">Action & Impact Verbs</span>
                    </div>
                    {expandedSection === "verbs" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "verbs" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5 pt-0 border-t border-white/5 text-base text-slate-400 space-y-3">
                          <div className="flex flex-wrap gap-2 mt-2">
                            {result.actionVerbs.strong.map((v, i) => (
                              <span key={i} className="px-3 py-1 bg-white/5 rounded border border-white/10 text-white">{v}</span>
                            ))}
                            {result.actionVerbs.weak.map((v, i) => (
                              <span key={i} className="px-3 py-1 bg-red-500/10 rounded border border-red-500/20 text-red-400 line-through">{v}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Keywords */}
                <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
                  <button onClick={() => toggleSection("keywords")} className="w-full flex items-center justify-between p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <FileSearch className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-lg text-slate-200">
                        Keyword Match ({result.keywords.matched.length}/{result.keywords.matched.length + result.keywords.missing.length})
                      </span>
                    </div>
                    {expandedSection === "keywords" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "keywords" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5 pt-0 border-t border-white/5 text-base text-slate-400">
                          <div className="flex flex-wrap gap-2">
                            {result.keywords.matched.map((k, i) => (
                              <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">{k.keyword}</span>
                            ))}
                            {result.keywords.missing.map((k, i) => (
                              <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded line-through">{k.keyword}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Formatting */}
                <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
                  <button onClick={() => toggleSection("formatting")} className="w-full flex items-center justify-between p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-lg text-slate-200">Formatting Issues</span>
                    </div>
                    {expandedSection === "formatting" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "formatting" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5 pt-0 border-t border-white/5 text-base text-slate-400">
                          <ul className="space-y-3">
                            {result.formattingIssues.map((issue, i) => (
                              <li key={i} className="flex items-start gap-3">
                                {issue.type === "pass"
                                  ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                  : issue.type === "error"
                                  ? <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                  : <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                                <span>{issue.message}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sections */}
                <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden md:col-span-2">
                  <button onClick={() => toggleSection("sections")} className="w-full flex items-center justify-between p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <LayoutTemplate className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-lg text-slate-200">Core Section Presence</span>
                    </div>
                    {expandedSection === "sections" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "sections" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5 pt-0 border-t border-white/5 text-base text-slate-400">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {result.sections.map((sec, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {sec.present
                                  ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                                  : <XCircle className="w-5 h-5 text-red-400" />}
                                <span className={sec.present ? "text-slate-300" : "text-slate-500"}>{sec.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden md:col-span-2">
                    <button onClick={() => toggleSection("recommendations")} className="w-full flex items-center justify-between p-5 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-lg text-slate-200">
                          Recommendations ({result.recommendations.length})
                        </span>
                      </div>
                      {expandedSection === "recommendations" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === "recommendations" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-5 pt-0 border-t border-white/5 text-base text-slate-400">
                            <ol className="space-y-3 list-decimal pl-5">
                              {result.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ol>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default ATSScoreChecker;
