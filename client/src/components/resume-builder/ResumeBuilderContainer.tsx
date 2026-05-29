"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Code,
  Award,
  Plus,
  Trash2,
  Download,
  Eye,
  Sparkles,
  Layout
} from "lucide-react";
import Link from "next/link";
import ROUTES from "@/routes";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeData {
  templateStyle: "modern" | "classic" | "minimal";
  profilePhoto: string | null;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    title: string;
    dob: string;
    hobbies: string;
  };
  summary: string;
  softSkills: Array<{ id: string; name: string }>;
  languages: Array<{ id: string; name: string }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    year: string;
  }>;
  references: Array<{
    id: string;
    name: string;
    contact: string;
  }>;
}

export default function ResumeBuilderContainer() {
  const [activeTab, setActiveTab] = useState<"upload" | "manual" | "latex">("upload");
  const [latexCode, setLatexCode] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    templateStyle: "modern",
    profilePhoto: null,
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      title: "",
      dob: "",
      hobbies: "",
    },
    summary: "",
    softSkills: [],
    languages: [],
    experience: [],
    education: [],
    references: [],
  });

  const addItem = (field: string, defaultObj: any) => {
    const list = (resumeData as any)[field] || [];
    setResumeData({
      ...resumeData,
      [field]: [...list, { ...defaultObj, id: Date.now().toString() }]
    });
  };

  const removeItem = (field: string, id: string) => {
    const list = (resumeData as any)[field] || [];
    setResumeData({
      ...resumeData,
      [field]: list.filter((item: any) => item.id !== id)
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload a PDF or DOCX file.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB. Please upload a smaller file.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('templateStyle', resumeData.templateStyle);
      if (targetRole.trim()) formData.append('targetRole', targetRole.trim());

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to upload resume');
      }

      // Update state with extracted data
      setResumeData({
        ...resumeData,
        ...data.resume.resumeData
      });
      setLatexCode(data.resume.latexCode);
      setHasGenerated(true);
      
      // Switch to manual tab to show extracted data
      setActiveTab('manual');

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to process resume upload. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      
      // Trigger the change event
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const loadFromProfile = async () => {
    setIsLoadingProfile(true);
    setUploadError(null);
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) throw new Error("Could not load profile. Please ensure you are logged in.");
      const data = await response.json();
      const user = data.user || data;
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          name: user.username || user.name || prev.personalInfo.name,
          email: user.email || prev.personalInfo.email,
          phone: user.phone || prev.personalInfo.phone,
          address: user.address || prev.personalInfo.address,
          title: user.title || prev.personalInfo.title,
        },
      }));
    } catch (err: any) {
      setUploadError(err.message || "Failed to load profile data.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const res = await fetch("/api/resume/upload-photo", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Photo upload failed");
      setResumeData((prev) => ({ ...prev, profilePhoto: data.photoUrl }));
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const downloadPdf = async () => {
    if (!hasGenerated) return;
    setIsCompiling(true);
    setUploadError(null);
    try {
      const res = await fetch("/api/resume/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, targetRole: targetRole.trim() }),
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "PDF generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const name = resumeData.personalInfo.name?.replace(/\s+/g, "_") || "resume";
      a.href = url;
      a.download = `${name}_resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to generate PDF");
    } finally {
      setIsCompiling(false);
    }
  };

  const downloadLatex = () => {    if (!latexCode) return;
    const name = resumeData.personalInfo.name?.replace(/\s+/g, "_") || "resume";
    const blob = new Blob([latexCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}_resume.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateLatex = async () => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeData,
          templateStyle: resumeData.templateStyle,
          targetRole: targetRole.trim(),
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to generate resume');
      }

      setLatexCode(data.resume.latexCode);
      setHasGenerated(true);

    } catch (error: any) {
      console.error('Generate error:', error);
      setUploadError(error.message || 'Failed to generate resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full relative z-10 flex flex-col h-[calc(100vh-140px)] min-h-[700px]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">ATS Resume Builder</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={downloadLatex}
            disabled={!hasGenerated}
            className="px-4 py-2.5 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            <Code className="w-4 h-4" />
            .tex
          </button>
          <button
            onClick={downloadPdf}
            disabled={!hasGenerated || isCompiling}
            className="px-6 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCompiling ? (
              <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Generating PDF...</>
            ) : (
              <><Download className="w-4 h-4" /> Download PDF</>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        
        {/* Left Section */}
        <div className="flex flex-col h-full min-h-0 lg:col-span-3">
          
          {/* Chrome-like Tabs */}
          <div className="flex px-4 gap-1 z-10 relative -mb-px">
            {[
              { id: "upload", icon: Upload, label: "Upload Resume" },
              { id: "manual", icon: FileText, label: "Build Manually" },
              { id: "latex", icon: Code, label: "LaTeX Editor" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 rounded-t-xl text-sm font-medium transition-all flex items-center gap-2 border-x border-t ${
                  activeTab === tab.id 
                    ? "bg-[#111111]/90 backdrop-blur-md border-white/10 border-b-[#111111]/90 text-white z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]" 
                    : "bg-black/20 border-transparent text-slate-400 hover:text-white hover:bg-black/40 z-0"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Left Panel - Input Area */}
          <div className="glass-card flex flex-col flex-1 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md bg-[#111111]/90 shadow-2xl z-10 relative">
            <div className="p-6 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              
              {/* Upload Tab */}
              {activeTab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/20 flex items-center justify-center mb-6">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Upload Your Resume</h3>
                  <p className="text-slate-400 max-w-md mb-8">
                    Drop your PDF or DOCX resume here, and we'll extract all the information automatically using AI.
                  </p>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Target Role input */}
                  <div className="w-full max-w-md mb-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Target Role <span className="text-slate-500 font-normal">(optional — for ATS optimisation)</span>
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer at Stripe"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all text-sm"
                    />
                  </div>
                  
                  {/* Upload area */}
                  <div 
                    onClick={handleUploadClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="w-full max-w-md border-2 border-dashed border-white/20 rounded-2xl p-12 hover:border-white/50 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-3">
                      {isUploading ? (
                        <>
                          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                          <p className="text-sm text-white font-semibold">Processing your resume...</p>
                          <p className="text-xs text-slate-400">This may take a moment</p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-12 h-12 text-slate-500" />
                          <p className="text-sm text-slate-400">
                            <span className="text-white font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500">PDF, DOCX up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Error message */}
                  {uploadError && (
                    <div className="mt-6 w-full max-w-md p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-sm text-red-400">{uploadError}</p>
                    </div>
                  )}
                </motion.div>
              )}


              {/* Manual Entry Tab */}
              {activeTab === "manual" && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 pb-10"
                >
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Resume Information</h2>
                    <p className="text-sm text-slate-400">Fill in your details to generate your professional resume</p>
                  </div>

                  {/* Target Role + Load from Profile */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        Target Role for ATS Optimisation
                      </label>
                      <button
                        onClick={loadFromProfile}
                        disabled={isLoadingProfile}
                        className="px-3 py-1.5 bg-white/10 border border-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isLoadingProfile ? (
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                        Load from Profile
                      </button>
                    </div>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer at Stripe"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all text-sm"
                    />
                    {targetRole.trim() && (
                      <p className="text-xs text-yellow-400/80">
                        ✦ AI will tailor your resume specifically for this role
                      </p>
                    )}
                  </div>

                  {/* Choose Template Style */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm font-semibold text-white">Choose Template Style</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "modern", name: "Modern", desc: "Two columns" },
                        { id: "classic", name: "Classic", desc: "Traditional" },
                        { id: "minimal", name: "Minimal", desc: "Clean & simple" }
                      ].map(template => (
                        <div 
                          key={template.id}
                          onClick={() => setResumeData({...resumeData, templateStyle: template.id as any})}
                          className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                            resumeData.templateStyle === template.id 
                              ? 'border-white bg-white/10' 
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <h4 className={`text-sm font-semibold ${resumeData.templateStyle === template.id ? 'text-white' : 'text-slate-300'}`}>{template.name}</h4>
                          <p className={`text-xs ${resumeData.templateStyle === template.id ? 'text-slate-300' : 'text-slate-500'}`}>{template.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white">Profile Photo <span className="text-slate-500 font-normal">(optional)</span></h3>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/20 rounded-2xl p-8 hover:border-white/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
                    >
                      {resumeData.profilePhoto ? (
                        <div className="flex flex-col items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resumeData.profilePhoto}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                          />
                          <p className="text-xs text-slate-400">Click to change photo</p>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-white/5 rounded-full">
                            <Upload className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-300 font-medium">Click to upload profile photo</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Input Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData({...resumeData, personalInfo: { ...resumeData.personalInfo, name: e.target.value }})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                        placeholder="Basil Hailward"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Job Title <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={resumeData.personalInfo.title}
                        onChange={(e) => setResumeData({...resumeData, personalInfo: { ...resumeData.personalInfo, title: e.target.value }})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                        placeholder="UI/UX Designer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Phone Number <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({...resumeData, personalInfo: { ...resumeData.personalInfo, phone: e.target.value }})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                        placeholder="+00 000 0000 0000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Email <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({...resumeData, personalInfo: { ...resumeData.personalInfo, email: e.target.value }})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                        placeholder="www.lorem.example.com"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Address</label>
                      <input 
                        type="text" 
                        value={resumeData.personalInfo.address}
                        onChange={(e) => setResumeData({...resumeData, personalInfo: { ...resumeData.personalInfo, address: e.target.value }})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                        placeholder="123 Street Name City Name, State, Country, 12345"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Date of Birth</label>
                      <input 
                        type="text" 
                        value={resumeData.personalInfo.dob}
                        onChange={(e) => setResumeData({...resumeData, personalInfo: { ...resumeData.personalInfo, dob: e.target.value }})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                        placeholder="dd/mm/yyyy"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Hobbies & Interests</label>
                      <input 
                        type="text" 
                        value={resumeData.personalInfo.hobbies}
                        onChange={(e) => setResumeData({...resumeData, personalInfo: { ...resumeData.personalInfo, hobbies: e.target.value }})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                        placeholder="Photography, Reading, Traveling, etc."
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">About Me</label>
                      <textarea 
                        value={resumeData.summary}
                        onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all resize-none"
                        placeholder="Write a brief professional summary highlighting your key achievements and career goals..."
                      />
                    </div>
                  </div>

                  {/* List Sections */}
                  {[
                    { id: "softSkills", label: "Soft Skills", btnText: "Add Skill" },
                    { id: "languages", label: "Languages", btnText: "Add Language" },
                    { id: "experience", label: "Experience", btnText: "Add Experience" },
                    { id: "education", label: "Education", btnText: "Add Education" },
                    { id: "references", label: "References", btnText: "Add Reference" },
                  ].map((section) => (
                    <div key={section.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">{section.label}</h3>
                        <button 
                          onClick={() => addItem(section.id, { name: "", company: "", institution: "" })}
                          className="px-4 py-1.5 border border-white/30 text-white rounded-full text-xs font-medium hover:bg-white/10 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {section.btnText}
                        </button>
                      </div>
                      
                      {!(resumeData as any)[section.id] || (resumeData as any)[section.id].length === 0 ? (
                        <div className="w-full border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-1">
                          <p className="text-sm text-slate-300">No {section.label.toLowerCase()} added yet</p>
                          <p className="text-xs text-slate-500">Click "{section.btnText}" to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {((resumeData as any)[section.id] as any[]).map((item, idx) => {
                            // Pick the most descriptive label available on the item
                            const label =
                              item.name ||
                              item.position ||
                              item.degree ||
                              item.company ||
                              item.institution ||
                              `Item ${idx + 1}`;
                            // Ensure key is always a unique string
                            const key = item.id != null ? String(item.id) : `${section.id}-${idx}`;
                            return (
                              <div key={key} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                <span className="text-sm text-slate-300">{label}</span>
                                <button onClick={() => removeItem(section.id, item.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Generate Button */}
                  <div className="pt-8 space-y-3">
                    {uploadError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
                        <p className="text-sm text-red-400">{uploadError}</p>
                      </div>
                    )}
                    
                    <button 
                      onClick={generateLatex}
                      disabled={isUploading}
                      className="w-full px-6 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          Generate Resume
                        </>
                      )}
                    </button>
                    
                    {hasGenerated && (
                      <button 
                        onClick={() => setActiveTab("latex")}
                        className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Code className="w-4 h-4" />
                        Edit LaTeX Code
                      </button>
                    )}
                  </div>
                </motion.div>
              )}


              {/* LaTeX Editor Tab */}
              {activeTab === "latex" && (
                <motion.div
                  key="latex"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 border border-white/20 rounded-lg">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">LaTeX Editor</h3>
                        <p className="text-xs text-slate-400">Edit your resume code directly</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={downloadPdf}
                      disabled={isCompiling}
                      className="px-3 py-1.5 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                      {isCompiling ? (
                        <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating...</>
                      ) : (
                        <><Eye className="w-4 h-4" /> Compile to PDF</>
                      )}
                    </button>
                  </div>
                  
                  <textarea 
                    value={latexCode}
                    onChange={(e) => setLatexCode(e.target.value)}
                    className="flex-1 w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-slate-300 font-mono text-sm focus:outline-none focus:border-white/50 resize-none"
                    placeholder="% Your LaTeX code will appear here..."
                    spellCheck={false}
                  />
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>
        </div>
        </div>


        {/* Right Panel - Resume Preview */}
        <div className="glass-card flex flex-col h-full lg:col-span-2 rounded-2xl border border-white/10 overflow-hidden relative backdrop-blur-md bg-[#111111]/90 shadow-2xl">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 w-full shrink-0 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Resume Preview</h2>
              <p className="text-xs text-slate-400 mt-0.5">{resumeData.templateStyle.charAt(0).toUpperCase() + resumeData.templateStyle.slice(1)} style</p>
            </div>
            {hasGenerated && (
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadLatex}
                  className="px-2.5 py-1.5 bg-white/10 border border-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-all flex items-center gap-1.5"
                >
                  <Code className="w-3.5 h-3.5" />
                  .tex
                </button>
                <button
                  onClick={downloadPdf}
                  disabled={isCompiling}
                  className="px-2.5 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isCompiling ? (
                    <div className="w-3 h-3 border border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  PDF
                </button>
              </div>
            )}
          </div>
          
          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {hasGenerated && resumeData.personalInfo.name ? (
              <ResumePreview data={resumeData} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 mb-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <FileText className="w-9 h-9 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Preview Yet</h3>
                <p className="text-slate-500 text-xs max-w-[200px]">
                  Fill in your details and click Generate Resume to see a live preview
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Inline Resume Preview Component ─────────────────────────────────────────

function ResumePreview({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, softSkills, languages, references } = data;

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-xl text-[10px] leading-snug font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white px-5 py-4">
        <h1 className="text-lg font-bold tracking-wide uppercase">
          {personalInfo.name || "Your Name"}
        </h1>
        {personalInfo.title && (
          <p className="text-gray-300 text-[10px] mt-0.5 tracking-widest uppercase">{personalInfo.title}</p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-gray-400 text-[9px]">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>✆ {personalInfo.phone}</span>}
          {personalInfo.address && <span>⌖ {personalInfo.address}</span>}
        </div>
      </div>

      <div className="flex">
        {/* Left column */}
        <div className="w-[38%] bg-gray-100 px-3 py-3 space-y-3 shrink-0">

          {/* About */}
          {summary && (
            <Section title="About Me">
              <p className="text-gray-600 leading-relaxed">{summary}</p>
            </Section>
          )}

          {/* Skills */}
          {softSkills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-1">
                {softSkills.map((s, i) => (
                  <span key={i} className="bg-gray-800 text-white px-1.5 py-0.5 rounded text-[8px]">{s.name}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <Section title="Languages">
              {languages.map((l, i) => (
                <div key={i} className="flex justify-between text-gray-700">
                  <span>{l.name}</span>
                  {(l as any).proficiency && <span className="text-gray-400">{(l as any).proficiency}</span>}
                </div>
              ))}
            </Section>
          )}

          {/* DOB / Hobbies */}
          {(personalInfo.dob || personalInfo.hobbies) && (
            <Section title="Personal">
              {personalInfo.dob && <p className="text-gray-600">Born: {personalInfo.dob}</p>}
              {personalInfo.hobbies && <p className="text-gray-600 mt-0.5">{personalInfo.hobbies}</p>}
            </Section>
          )}

          {/* References */}
          {references.length > 0 && (
            <Section title="References">
              {references.map((r, i) => (
                <div key={i} className="mb-1">
                  <p className="font-semibold text-gray-800">{r.name}</p>
                  <p className="text-gray-500">{r.contact}</p>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 px-4 py-3 space-y-3">

          {/* Experience */}
          {experience.length > 0 && (
            <Section title="Experience">
              {experience.map((exp, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-800">{exp.position}</p>
                    <p className="text-gray-400 text-[8px] shrink-0 ml-1">{exp.duration}</p>
                  </div>
                  <p className="text-gray-500 italic">{exp.company}{(exp as any).location ? ` · ${(exp as any).location}` : ""}</p>
                  {exp.description && (
                    <p className="text-gray-600 mt-0.5 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-800">{edu.degree}</p>
                    <p className="text-gray-400 text-[8px] shrink-0 ml-1">{edu.year}</p>
                  </div>
                  <p className="text-gray-500 italic">{edu.institution}</p>
                </div>
              ))}
            </Section>
          )}

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-300 pb-0.5 mb-1.5">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
