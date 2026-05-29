"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  FileText, CheckCircle, XCircle, AlertTriangle,
  ChevronDown, ChevronUp, ShieldCheck, LayoutTemplate,
  Briefcase, TrendingUp, Target, FileSearch, Loader2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GLSLHills } from "@/components/ui/glsl-hills";
import type { AtsResult } from "@/models/AtsResult";

// Extend with the Mongoose _id field for the frontend
type AtsResultDoc = AtsResult & { _id: string };

const ATSScoreChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "complete">("idle");
  const [score, setScore] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<AtsResultDoc | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    gsap.fromTo(".ats-stagger",
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
      value: targetScore, duration: 2, ease: "power4.out",
      onUpdate: () => setScore(Math.round(obj.value)),
    });
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStatus("uploading");
    setUploadProgress(0);

    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress = Math.min(progress + 4, 90);
      setUploadProgress(progress);
      if (progress >= 90) clearInterval(uploadInterval);
    }, 80);

    let fetchDone = false;
    let pendingResult: AtsResultDoc | null = null;
    let pendingError: string | null = null;

    const transitionTimer = setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      setTimeout(() => {
        if (!fetchDone) {
          setStatus("analyzing");
        } else if (pendingError) {
          setError(pendingError);
          setStatus("idle");
        } else if (pendingResult) {
          setResult(pendingResult);
          setStatus("complete");
          animateScore(pendingResult.atsScore);
        }
      }, 400);
    }, 1800);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("jobRole", jobRole);

      // ── Hit the native Next.js route directly ──────────────────────────
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      fetchDone = true;

      if (!response.ok) {
        pendingError = data.error || "Analysis failed. Please try again.";
        if (statusRef.current === "analyzing") {
          setError(pendingError);
          setStatus("idle");
        }
        return;
      }

      pendingResult = data.result as AtsResultDoc;
      if (statusRef.current === "analyzing") {
        setResult(pendingResult);
        setStatus("complete");
        animateScore(pendingResult.atsScore);
      }
    } catch {
      fetchDone = true;
      pendingError = "Network error. Please try again.";
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
    setStatus("idle"); setScore(0); setResult(null);
    setFile(null); setError(null); setJobRole("");
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

          {/* ── IDLE ──────────────────────────────────────────────────────── */}
          {status === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="ats-stagger flex flex-col justify-center gap-8 bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              {error && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
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
                  <input type="text" placeholder="e.g. Senior Frontend Engineer"
                    value={jobRole} onChange={(e) => setJobRole(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              <div
                onDragOver={handleDragOver} onDrop={handleDrop}
                onClick={() => jobRole.trim().length > 0 && fileInputRef.current?.click()}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-96 rounded-3xl border-2 border-dashed transition-all overflow-hidden bg-[#111]/50 backdrop-blur-sm",
                  jobRole.trim().length > 0
                    ? "border-slate-600 hover:border-emerald-400/50 hover:bg-emerald-400/5 cursor-pointer"
                    : "border-slate-700/50 cursor-not-allowed opacity-50"
                )}
              >
                <input ref={fileInputRef} type="file" accept=".pdf"
                  className="hidden" onChange={handleFileChange}
                  disabled={jobRole.trim().length === 0}
                />
                <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center pointer-events-none">
                  <div className="flex gap-4 mb-8">
                    <div className="relative flex items-center justify-center bg-red-500/10 text-red-400 p-4 rounded-2xl transform -rotate-6 shadow-lg border border-red-500/20">
                      <FileText className="w-10 h-10" />
                      <span className="absolute -bottom-2 -right-2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded shadow-sm">PDF</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">Drag & Drop Resume</p>
                  <p className="text-base text-slate-400 mb-8">Supports PDF (Max 5MB)</p>
                  <button type="button" disabled={jobRole.trim().length === 0}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="pointer-events-auto border border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-3 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Browse Files
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── UPLOADING ─────────────────────────────────────────────────── */}
          {status === "uploading" && (
            <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }} className="flex items-center justify-center h-96"
            >
              <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-emerald-500/20 blur-[80px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-white tracking-tight">Uploading &ldquo;{file?.name}&rdquo;</h3>
                  <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                      initial={{ width: "0%" }} animate={{ width: `${uploadProgress}%` }} transition={{ ease: "linear" }}
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

          {/* ── ANALYZING ─────────────────────────────────────────────────── */}
          {status === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
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
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="border border-white/5 rounded-xl bg-white/[0.02] p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                      <div className="h-6 bg-white/5 rounded-md w-1/3 animate-pulse" />
                    </div>
                    <div className="space-y-3 mt-2">
                      <div className="h-4 bg-white/5 rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-md w-4/5 animate-pulse" />
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

          {/* ── COMPLETE ──────────────────────────────────────────────────── */}
          {status === "complete" && result && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col border border-white/10 rounded-2xl bg-[#111]/60 backdrop-blur-md overflow-hidden shadow-xl"
            >
              {/* Score header */}
              <div className={cn("flex flex-col md:flex-row items-center gap-8 p-8 border-b border-white/5", getScoreBgColor(score))}>
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-800" strokeWidth="6" />
                    <circle cx="50" cy="50" r="45" fill="none"
                      className={getScoreColor(score)} strokeWidth="6" strokeLinecap="round"
                      strokeDasharray="283" strokeDashoffset={283 - (283 * score) / 100}
                      style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn("text-5xl font-black tabular-nums", getScoreColor(score).split(" ")[0])}>
                      {score}
                    </span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-black text-white mb-3">{result.verdict}</h3>
                  <p className="text-lg text-slate-300 max-w-2xl">{result.summary}</p>
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    <Button variant="outline" onClick={handleReset}
                      className="border-white/20 text-white hover:bg-white/10 rounded-full px-6 transition-colors">
                      Scan Another Resume
                    </Button>
                  </div>
                </div>
              </div>

              {/* Detail cards */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0a0a]/50">

                {/* Metrics */}
                <DetailCard id="metrics" label={`Quantifiable Metrics (${result.metrics.count})`}
                  icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-emerald-500/10 text-emerald-400"
                  expanded={expandedSection} onToggle={toggleSection}
                >
                  <p>Found <strong className="text-white">{result.metrics.count} metric{result.metrics.count !== 1 ? "s" : ""}</strong> backing your achievements.</p>
                  {result.metrics.examples.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      {result.metrics.examples.map((ex, i) => (
                        <li key={i}>&ldquo;{ex}&rdquo; <CheckCircle className="inline w-3 h-3 text-emerald-400 ml-1" /></li>
                      ))}
                    </ul>
                  )}
                </DetailCard>

                {/* Action Verbs */}
                <DetailCard id="verbs" label="Action & Impact Verbs"
                  icon={<Target className="w-5 h-5" />} iconBg="bg-emerald-500/10 text-emerald-400"
                  expanded={expandedSection} onToggle={toggleSection}
                >
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.actionVerbs.strong.map((v, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded border border-white/10 text-white text-sm">{v}</span>
                    ))}
                    {result.actionVerbs.weak.map((v, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/10 rounded border border-red-500/20 text-red-400 line-through text-sm">{v}</span>
                    ))}
                  </div>
                </DetailCard>

                {/* Keywords */}
                <DetailCard
                  id="keywords"
                  label={`Keywords (${result.matchedKeywords.length} matched / ${result.missingKeywords.length} missing)`}
                  icon={<FileSearch className="w-5 h-5" />} iconBg="bg-amber-500/10 text-amber-400"
                  expanded={expandedSection} onToggle={toggleSection}
                >
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-sm">{k}</span>
                    ))}
                    {result.missingKeywords.map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded line-through text-sm">{k}</span>
                    ))}
                  </div>
                </DetailCard>

                {/* Formatting */}
                <DetailCard id="formatting" label="Formatting Issues"
                  icon={<AlertTriangle className="w-5 h-5" />} iconBg="bg-amber-500/10 text-amber-400"
                  expanded={expandedSection} onToggle={toggleSection}
                >
                  <ul className="space-y-3">
                    {result.formattingIssues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {issue.type === "pass" ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          : issue.type === "error" ? <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          : <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                        <span>{issue.message}</span>
                      </li>
                    ))}
                  </ul>
                </DetailCard>

                {/* Sections — full width */}
                <DetailCard id="sections" label="Core Section Presence"
                  icon={<LayoutTemplate className="w-5 h-5" />} iconBg="bg-emerald-500/10 text-emerald-400"
                  expanded={expandedSection} onToggle={toggleSection} fullWidth
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.sections.map((sec, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {sec.present ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                        <span className={sec.present ? "text-slate-300" : "text-slate-500"}>{sec.name}</span>
                      </div>
                    ))}
                  </div>
                </DetailCard>

                {/* Recommendations — full width */}
                {result.recommendations.length > 0 && (
                  <DetailCard id="recommendations" label={`Recommendations (${result.recommendations.length})`}
                    icon={<ShieldCheck className="w-5 h-5" />} iconBg="bg-blue-500/10 text-blue-400"
                    expanded={expandedSection} onToggle={toggleSection} fullWidth
                  >
                    <ol className="space-y-3 list-decimal pl-5">
                      {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ol>
                  </DetailCard>
                )}

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Reusable collapsible detail card ────────────────────────────────────────
interface DetailCardProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  expanded: string | null;
  onToggle: (id: string) => void;
  fullWidth?: boolean;
  children: React.ReactNode;
}

function DetailCard({ id, label, icon, iconBg, expanded, onToggle, fullWidth, children }: DetailCardProps) {
  const isOpen = expanded === id;
  return (
    <div className={cn("border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden", fullWidth && "md:col-span-2")}>
      <button onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>{icon}</div>
          <span className="font-semibold text-lg text-slate-200">{label}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-white/5 text-base text-slate-400 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ATSScoreChecker;
