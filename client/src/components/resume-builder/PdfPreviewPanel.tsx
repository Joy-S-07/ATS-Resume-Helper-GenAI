"use client";

import { FileText, Download, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfPreviewPanelProps {
  pdfUrl: string | null;
  isCompiling: boolean;
}

export default function PdfPreviewPanel({ pdfUrl, isCompiling }: PdfPreviewPanelProps) {
  const handleDownload = () => {
    if (!pdfUrl) return;

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
            <p className="font-medium animate-pulse">Generating PDF...</p>
          </div>
        )}

        {!pdfUrl && !isCompiling && (
          <div className="text-center text-slate-500 flex flex-col items-center max-w-sm">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p>Your compiled PDF will appear here.</p>
            <p className="text-xs mt-2 opacity-60">Generate your resume and click "Compile to PDF".</p>
          </div>
        )}

        {pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full border-none bg-white rounded-sm"
            title="Resume PDF Preview"
          />
        )}

      </div>
    </div>
  );
}
