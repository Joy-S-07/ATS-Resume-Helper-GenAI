"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  LayoutTemplate,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ATSScoreChecker = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, analyzing, complete
  const [score, setScore] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [jobRole, setJobRole] = useState("");
  
  const containerRef = useRef(null);
  const scannerRef = useRef(null);
  const scoreTextRef = useRef(null);

  // Initial Entrance Animation
  useEffect(() => {
    gsap.fromTo(
      ".ats-stagger",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setStatus("analyzing");

    // Laser scanning animation using GSAP
    if (scannerRef.current) {
      gsap.fromTo(
        scannerRef.current,
        { top: "0%", opacity: 0 },
        {
          top: "100%",
          opacity: 1,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "linear",
        }
      );
    }

    // Mock analysis delay
    setTimeout(() => {
      if (scannerRef.current) gsap.killTweensOf(scannerRef.current);
      setStatus("complete");
      animateScore(86); // Mock score
    }, 3000);
  };

  const animateScore = (targetScore) => {
    const obj = { value: 0 };
    gsap.to(obj, {
      value: targetScore,
      duration: 2,
      ease: "power4.out",
      onUpdate: () => {
        setScore(Math.round(obj.value));
      },
    });
  };

  const getScoreColor = (s) => {
    if (s >= 76) return "text-emerald-400 stroke-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]";
    if (s >= 51) return "text-amber-400 stroke-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    return "text-red-400 stroke-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]";
  };
  
  const getScoreBgColor = (s) => {
    if (s >= 76) return "bg-emerald-500/10";
    if (s >= 51) return "bg-amber-500/10";
    return "bg-red-500/10";
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">
      
      {/* Background Animated Mesh / Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12">
        <div className="text-center mb-10 ats-stagger">
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-3">
            ATS Score Checker
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Upload your resume to see how applicant tracking systems read and score your profile based on industry standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* LEFT: Upload / Scanning Area */}
          <div className="ats-stagger flex flex-col h-full justify-center gap-6">
            <div className="w-full">
              <label className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-2 block ml-1">Target Job Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  disabled={status !== "idle"}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder-slate-600" 
                />
              </div>
            </div>

            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all overflow-hidden bg-[#111]/50 backdrop-blur-sm",
                status === "idle" && jobRole.trim().length > 0 ? "border-slate-600 hover:border-emerald-400/50 hover:bg-emerald-400/5 cursor-pointer" : "border-slate-700/50 cursor-not-allowed opacity-50"
              )}
            >
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                className="hidden" 
                id="resume-upload" 
                onChange={handleFileChange}
                disabled={status !== "idle" || jobRole.trim().length === 0}
              />

              {status === "idle" && (
                <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-lg font-semibold text-white mb-2">Drag & Drop Resume</p>
                  <p className="text-sm text-slate-400 mb-6">Supports PDF, DOCX (Max 5MB)</p>
                  <Button disabled={jobRole.trim().length === 0} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 rounded-full px-6">
                    Browse Files
                  </Button>
                </label>
              )}

              {status === "analyzing" && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="relative w-24 h-32 bg-white/5 border border-white/10 rounded-lg p-2 mb-6 overflow-hidden">
                    <FileText className="w-full h-full text-slate-500/50" />
                    {/* Laser Scanner */}
                    <div 
                      ref={scannerRef} 
                      className="absolute left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_10px_#34d399,0_0_20px_#34d399] z-10"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white animate-pulse">Scanning Document...</h3>
                  <p className="text-sm text-slate-400 mt-2">Extracting keywords & formatting</p>
                </div>
              )}

              {status === "complete" && (
                <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Analysis Complete</h3>
                  <p className="text-sm text-slate-400 mb-6 truncate max-w-xs">{file?.name || "resume.pdf"}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => { setStatus("idle"); setScore(0); }}
                    className="border-white/10 text-slate-300 hover:bg-white/5 rounded-full px-6"
                  >
                    Scan Another File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Score & Feedback (Only visible when complete) */}
          <div className="ats-stagger flex flex-col h-full min-h-[320px]">
            {status === "idle" || status === "analyzing" ? (
              <div className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/[0.02] p-8 text-center">
                <Cpu className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">Awaiting Resume</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Upload your document to reveal AI-driven insights, keyword matches, and a detailed ATS parse report.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col border border-white/10 rounded-2xl bg-[#111]/60 backdrop-blur-md overflow-hidden shadow-xl"
              >
                {/* Top Score Section */}
                <div className={cn("flex items-center gap-6 p-6 border-b border-white/5", getScoreBgColor(score))}>
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-800" strokeWidth="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        className={getScoreColor(score)} 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * score) / 100}
                        style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={cn("text-2xl font-black tabular-nums", getScoreColor(score).split(' ')[0])}>
                        {score}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">Great Match!</h3>
                    <p className="text-sm text-slate-300">Your resume passed core ATS checks. See details below to hit 95%+.</p>
                  </div>
                </div>

                {/* Feedback Accordion */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  
                  {/* Keywords */}
                  <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
                    <button onClick={() => toggleSection('keywords')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-200">Parsed Keywords</span>
                      </div>
                      {expandedSection === 'keywords' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'keywords' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-4 pt-0 text-sm border-t border-white/5">
                            <p className="text-slate-400 mb-3">We found 18/20 critical keywords for {jobRole || "this role"}.</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">React</span>
                              <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">Next.js</span>
                              <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">TypeScript</span>
                              <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded line-through">GraphQL</span>
                              <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded line-through">Jest</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Formatting */}
                  <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
                    <button onClick={() => toggleSection('formatting')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-200">Formatting Issues</span>
                      </div>
                      {expandedSection === 'formatting' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'formatting' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-4 pt-0 text-sm border-t border-white/5">
                            <ul className="space-y-2 text-slate-400">
                              <li className="flex items-start gap-2">
                                <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>Multi-column layout detected. ATS systems may read text out of order.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>Standard fonts used (Arial, Calibri, etc).</span>
                              </li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Sections */}
                  <div className="border border-white/5 rounded-xl bg-white/[0.02] overflow-hidden">
                    <button onClick={() => toggleSection('sections')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <LayoutTemplate className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-200">Section Presence</span>
                      </div>
                      {expandedSection === 'sections' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'sections' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-4 pt-0 text-sm border-t border-white/5">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-slate-300">Contact Info</span></div>
                              <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-slate-300">Experience</span></div>
                              <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-slate-300">Education</span></div>
                              <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-slate-300">Skills</span></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                <div className="p-4 border-t border-white/10 bg-black/20">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl py-6">
                    <ShieldCheck className="w-5 h-5 mr-2" /> Auto-Fix Issues
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreChecker;
