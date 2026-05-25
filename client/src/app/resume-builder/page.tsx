import React from "react";
import ResumeBuilderContainer from "@/components/resume-builder/ResumeBuilderContainer";
import { Sparkles, FileCode2 } from "lucide-react";
import ProceduralGroundBackground from "@/components/ui/animated-pattern-cloud";

export default function ResumeBuilderPage() {
  return (
    <div className="relative min-h-screen w-full bg-zinc-950 overflow-hidden">

      {/* Animated Background */}
      <ProceduralGroundBackground />

      <div className="relative z-10 pt-8 px-4 md:px-8 pb-8 h-full flex flex-col">
        {/* Header */}
        <div className="max-w-[1600px] w-full mx-auto mb-6 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl backdrop-blur-md shadow-lg">
                <FileCode2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">AI Resume Builder</h1>
                <p className="text-slate-400 text-sm">
                  Create professional LaTeX resumes in minutes
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Main Builder Interface */}
        <ResumeBuilderContainer />
      </div>

    </div>
  );
}
