"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, Edit3, Download } from "lucide-react";
import Link from "next/link";
import ROUTES from "@/routes";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeBuilderContainer() {
  const [activeTab, setActiveTab] = useState<"upload" | "manual" | "import">("upload");
  // Lifted state that will eventually feed the PDF viewer
  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    role: "",
  });

  return (
    <div className="w-full relative z-10 flex flex-col h-[calc(100vh-120px)] min-h-[800px]">
      
      {/* Navigation & State Controls (Top Left) */}
      <div className="flex items-center gap-6 mb-6">
        <Link 
          href={ROUTES.DASHBOARD}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/20 hover:bg-white/10 transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        
        <div className="flex p-1 bg-white/5 border border-white/20 rounded-full">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "upload" 
                ? "bg-white/10 text-white shadow-sm border border-white/10" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload own resume
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "manual" 
                ? "bg-white/10 text-white shadow-sm border border-white/10" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Manually add details
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "import" 
                ? "bg-white/10 text-white shadow-sm border border-white/10" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            <Download className="w-4 h-4" />
            Import data from profile
          </button>
        </div>
      </div>

      {/* Grid Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Left Pane (Input/Action Area) */}
        <div className="glass-card flex flex-col h-full rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Upload your existing resume</h3>
                  <p className="text-slate-400 max-w-md">
                    Drag and drop your PDF resume here, or click to browse. We'll extract your information automatically.
                  </p>
                  <button className="mt-4 px-6 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                    Select File
                  </button>
                </motion.div>
              )}

              {activeTab === "manual" && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Personal Details</h3>
                    <p className="text-slate-400 text-sm">Fill in your information to generate the LaTeX resume.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={resumeData.name}
                        onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Email</label>
                      <input 
                        type="email" 
                        value={resumeData.email}
                        onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">Professional Role</label>
                      <input 
                        type="text" 
                        value={resumeData.role}
                        onChange={(e) => setResumeData({...resumeData, role: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>

                  {/* Add more fields as needed for the manual builder */}
                  <div className="pt-4 border-t border-white/10 mt-6">
                    <button className="w-full px-4 py-3 bg-emerald-500/20 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
                      Generate LaTeX
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "import" && (
                <motion.div
                  key="import"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <Download className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Import from Profile</h3>
                  <p className="text-slate-400 max-w-md">
                    Use the details you've already saved in your My Info profile to instantly populate your resume.
                  </p>
                  <button className="mt-4 px-6 py-2.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold rounded-lg hover:bg-purple-500/30 transition-colors">
                    Import Data
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Pane (Preview Area) */}
        <div className="glass-card flex flex-col h-full rounded-xl border border-white/20 overflow-hidden relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">Compiled PDF Viewer</span>
            </div>
          </div>
          
          <div className="flex-1 bg-[#1a1a1a] m-2 mt-14 rounded-lg border border-white/5 flex items-center justify-center">
            {/* Future PDF Renderer Placeholder */}
            <div className="text-center">
              <p className="text-slate-500 text-sm">PDF will be rendered here</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
