"use client";

import React, { useState } from "react";
import DataExtractionPanel from "./DataExtractionPanel";
import LatexEditorPanel from "./LatexEditorPanel";
import PdfPreviewPanel from "./PdfPreviewPanel";

export default function ResumeBuilderContainer() {
  const [latexCode, setLatexCode] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDataExtracted = (code: string) => {
    setLatexCode(code);
    // Reset PDF when new data comes in
    setPdfUrl(null);
  };

  const handleCompile = () => {
    setIsCompiling(true);
    // Mock compilation process
    setTimeout(() => {
      setIsCompiling(false);
      setPdfUrl("mock-pdf-blob");
    }, 2500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1600px] mx-auto h-[calc(100vh-140px)] min-h-[800px]">
      
      {/* Left Column: Data & Code */}
      <div className="flex flex-col gap-6 w-full lg:w-1/2 xl:w-[45%] h-full">
        {/* Top: Data Source */}
        <div className="shrink-0">
          <DataExtractionPanel onDataExtracted={handleDataExtracted} />
        </div>

        {/* Bottom: LaTeX Editor */}
        <div className="flex-1 min-h-[300px]">
          <LatexEditorPanel 
            latexCode={latexCode} 
            onChange={setLatexCode} 
            onCompile={handleCompile}
            isCompiling={isCompiling}
          />
        </div>
      </div>

      {/* Right Column: PDF Preview */}
      <div className="w-full lg:w-1/2 xl:w-[55%] h-full">
        <PdfPreviewPanel 
          pdfUrl={pdfUrl} 
          isCompiling={isCompiling} 
        />
      </div>

    </div>
  );
}
