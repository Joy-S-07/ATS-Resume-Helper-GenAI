"use client";

import React from "react";
import { Code2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface LatexEditorPanelProps {
  latexCode: string;
  onChange: (code: string) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

export default function LatexEditorPanel({ latexCode, onChange, onCompile, isCompiling }: LatexEditorPanelProps) {
  return (
    <div className="bg-[#1F2023] border border-white/10 rounded-2xl flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white">LaTeX Source</h2>
        </div>
        <button
          onClick={onCompile}
          disabled={isCompiling || !latexCode}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            isCompiling || !latexCode 
              ? "bg-emerald-500/20 text-emerald-500/50 cursor-not-allowed" 
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          )}
        >
          {isCompiling ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
              Compiling...
            </span>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Compile PDF
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative bg-[#0D0D0F]">
        <textarea
          value={latexCode}
          onChange={(e) => onChange(e.target.value)}
          placeholder="% Generate LaTeX from profile or upload a file to begin..."
          className="absolute inset-0 w-full h-full resize-none bg-transparent text-slate-300 p-4 font-mono text-sm focus:outline-none focus:ring-0 custom-scrollbar leading-relaxed"
          spellCheck={false}
        />
      </div>

    </div>
  );
}
