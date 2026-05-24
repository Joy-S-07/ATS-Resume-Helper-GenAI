import React from "react";
import { motion } from "framer-motion";
import { Activity, Settings, FileText, Briefcase, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SidebarNav({ activeTab, setActiveTab }: SidebarNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-2 flex flex-col gap-1 shadow-lg"
    >
      <button
        onClick={() => setActiveTab("overview")}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
          activeTab === "overview"
            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <Activity className="w-4 h-4" />
        Overview
      </button>
      <button
        onClick={() => setActiveTab("settings")}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
          activeTab === "settings"
            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <Settings className="w-4 h-4" />
        My Info
      </button>
      <div className="w-full h-px bg-white/5 my-1" />
      <button
        onClick={() => setActiveTab("resumes")}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
          activeTab === "resumes"
            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <FileText className="w-4 h-4" />
        Resumes
      </button>
      <button
        onClick={() => setActiveTab("jobs")}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
          activeTab === "jobs"
            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <Briefcase className="w-4 h-4" />
        Job Tracker
      </button>
      <div className="w-full h-px bg-white/5 my-1" />
      <button
        onClick={() => setActiveTab("ats-score")}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left group",
          activeTab === "ats-score"
            ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)] border border-emerald-500/20"
            : "text-slate-400 hover:bg-emerald-500/5 hover:text-emerald-400"
        )}
      >
        <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
        ATS Score Check
      </button>
    </motion.div>
  );
}
