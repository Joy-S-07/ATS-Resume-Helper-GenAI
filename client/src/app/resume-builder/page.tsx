import React from "react";
import ResumeBuilderContainer from "@/components/resume-builder/ResumeBuilderContainer";
import { Sparkles } from "lucide-react";
import { EtherealShadow } from "@/components/ui/etheral-shadow";

export default function ResumeBuilderPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden">

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(20, 20, 25, 1)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="relative z-10 pt-8 px-4 md:px-8 pb-8 h-full flex flex-col">
        {/* Header */}
        <div className="max-w-[1600px] w-full mx-auto mb-6 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">AI Resume Builder</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Upload your old resume or import your profile data to instantly generate a professional LaTeX resume. Tweak the code and compile it to a stunning PDF.
          </p>
        </div>

        {/* Main Builder Interface */}
        <ResumeBuilderContainer />
      </div>

    </div>
  );
}
