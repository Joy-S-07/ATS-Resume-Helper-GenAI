"use client";

import { useState, useRef } from "react";
import { UploadCloud, User, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataExtractionPanelProps {
  onDataExtracted: (data: string) => void;
}

export default function DataExtractionPanel({ onDataExtracted }: DataExtractionPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      setError("Only .pdf or .docx files are allowed.");
      return;
    }

    setIsUploading(true);
    setSuccess(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to process file");

      setSuccess("File parsed successfully!");
      onDataExtracted(data.resume?.latexCode || "");
    } catch (err: any) {
      setError(err.message || "Failed to process file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleProfileImport = async () => {
    setIsImporting(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Could not load profile. Please ensure you are logged in.");
      const data = await res.json();
      setSuccess("Profile imported successfully!");
      onDataExtracted(data.resume?.latexCode || "");
    } catch (err: any) {
      setError(err.message || "Failed to import profile.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-[#1F2023] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">1. Data Source</h2>
        <p className="text-sm text-slate-400">Upload an existing resume or use your profile data to generate a LaTeX template.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dropzone */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer h-48",
            isDragging ? "border-blue-500 bg-blue-500/10" : "border-[#444444] bg-black/20 hover:border-blue-400/50 hover:bg-black/40"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx"
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center text-blue-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm font-medium">Extracting text...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#2A2B30] flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-slate-200">Click or drag file to this area to upload</p>
              <p className="text-xs text-slate-500 mt-1">Supports .pdf and .docx</p>
            </>
          )}
        </div>

        {/* Profile Import */}
        <div className="border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-black/20 h-48">
          {isImporting ? (
            <div className="flex flex-col items-center text-purple-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm font-medium">Building from profile...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#2A2B30] flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-4">Use My Profile Data</p>
              <button
                onClick={handleProfileImport}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Import Profile
              </button>
            </>
          )}
        </div>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </div>
  );
}


  return (
    <div className="bg-[#1F2023] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
      
      <div>
        <h2 className="text-xl font-bold text-white mb-1">1. Data Source</h2>
        <p className="text-sm text-slate-400">Upload an existing resume or use your profile data to generate a LaTeX template.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Dropzone */}
        <div 
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer h-48",
            isDragging ? "border-blue-500 bg-blue-500/10" : "border-[#444444] bg-black/20 hover:border-blue-400/50 hover:bg-black/40"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept=".pdf,.docx" 
            className="hidden" 
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center text-blue-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm font-medium">Extracting text...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#2A2B30] flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-slate-200">Click or drag file to this area to upload</p>
              <p className="text-xs text-slate-500 mt-1">Supports .pdf and .docx</p>
            </>
          )}
        </div>

        {/* Profile Import */}
        <div className="border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-black/20 h-48">
          {isImporting ? (
            <div className="flex flex-col items-center text-purple-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm font-medium">Building from profile...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#2A2B30] flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-4">Use My Profile Data</p>
              <button 
                onClick={handleProfileImport}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Import Profile
              </button>
            </>
          )}
        </div>

      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </motion.div>
      )}

    </div>
  );
}
