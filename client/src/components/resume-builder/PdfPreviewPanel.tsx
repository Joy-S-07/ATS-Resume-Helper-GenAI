"use client";

import React from "react";
import { FileText, Download, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfPreviewPanelProps {
  pdfUrl: string | null;
  isCompiling: boolean;
}

export default function PdfPreviewPanel({ pdfUrl, isCompiling }: PdfPreviewPanelProps) {
  const handleDownload = () => {
    if (!pdfUrl) return;
    // In a real app with a real blob URL, we'd trigger a download.
    // Since we might be mocking it for now, we'll just alert if it's the mock string.
    if (pdfUrl === "mock-pdf-blob") {
      alert("Mock PDF Downloaded! (Connect your LaTeX API to get real PDFs)");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#1F2023] border border-white/10 rounded-2xl flex flex-col h-full overflow-hidden relative">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-400" />
          <h2 className="text-sm font-bold text-white">PDF Preview</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
            title="Fullscreen Preview"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            disabled={!pdfUrl || isCompiling}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
              !pdfUrl || isCompiling
                ? "bg-transparent border-slate-600 text-slate-600 cursor-not-allowed"
                : "bg-transparent border-white/20 text-white hover:bg-white/10"
            )}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-[#111111] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar relative">
        
        {isCompiling && (
          <div className="absolute inset-0 z-10 bg-[#111111]/80 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-400">
            <span className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4"></span>
            <p className="font-medium animate-pulse">Compiling LaTeX...</p>
          </div>
        )}

        {!pdfUrl && !isCompiling ? (
          <div className="text-center text-slate-500 flex flex-col items-center max-w-sm">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p>Your compiled PDF will appear here.</p>
            <p className="text-xs mt-2 opacity-60">Generate LaTeX code and click "Compile PDF".</p>
          </div>
        ) : pdfUrl === "mock-pdf-blob" ? (
          // Mock PDF View (Simulating an A4 page)
          <div className="w-full max-w-[600px] aspect-[1/1.414] bg-white rounded-sm shadow-2xl p-8 md:p-12 text-black my-auto transform transition-transform">
            <div className="text-center border-b-2 border-black pb-4 mb-4">
              <h1 className="text-3xl font-serif font-bold uppercase tracking-wider">Alex Carter</h1>
              <p className="text-sm mt-2 font-sans text-gray-700">alex@example.com | San Francisco, CA | Senior Frontend Developer</p>
            </div>
            
            <h2 className="text-lg font-bold uppercase font-serif mt-6 mb-2 border-b border-gray-300">Summary</h2>
            <p className="text-sm font-sans leading-relaxed text-gray-800">
              Passionate frontend developer with 5+ years of experience building highly interactive web applications using React, Next.js, and Three.js.
            </p>

            <h2 className="text-lg font-bold uppercase font-serif mt-6 mb-2 border-b border-gray-300">Experience</h2>
            <div className="mb-3">
              <div className="flex justify-between font-bold text-sm">
                <span>Senior Frontend Developer, TechCorp Inc.</span>
                <span>2021 - Present</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between font-bold text-sm">
                <span>Frontend Developer, StartupXYZ</span>
                <span>2019 - 2021</span>
              </div>
            </div>

            <h2 className="text-lg font-bold uppercase font-serif mt-6 mb-2 border-b border-gray-300">Education</h2>
            <div className="flex justify-between font-bold text-sm">
              <span>B.S. Computer Science, Stanford University</span>
              <span>2019</span>
            </div>
            
            <h2 className="text-lg font-bold uppercase font-serif mt-6 mb-2 border-b border-gray-300">Skills</h2>
            <p className="text-sm font-sans text-gray-800">
              React, Next.js, TypeScript, Tailwind CSS, Three.js, Node.js
            </p>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-6xl font-black rotate-[-45deg]">MOCK PDF</span>
            </div>
          </div>
        ) : pdfUrl ? (
          // Real PDF iframe fallback
          <iframe 
            src={`${pdfUrl}#toolbar=0`} 
            className="w-full h-full border-none bg-white rounded-sm"
            title="Resume PDF Preview"
          />
        ) : null}

      </div>
    </div>
  );
}
