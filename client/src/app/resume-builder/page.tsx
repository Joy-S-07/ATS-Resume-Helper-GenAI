import React from "react";
import ResumeBuilderContainer from "@/components/resume-builder/ResumeBuilderContainer";
import { Sparkles } from "lucide-react";

export default function ResumeBuilderPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-12 px-4 md:px-8 pb-12">
      
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">AI Resume Builder</h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl">
          Upload your old resume or import your profile data to instantly generate a professional LaTeX resume. Tweak the code and compile it to a stunning PDF.
        </p>
      </div>

      {/* Main Builder Interface */}
      <ResumeBuilderContainer />

    </div>
  );
}
