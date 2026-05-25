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
      [field]: [...list, { id: Date.now().toString(), ...defaultObj }]
    });
  };

  const removeItem = (field: string, id: string) => {
    const list = (resumeData as any)[field] || [];
    setResumeData({
      ...resumeData,
      [field]: list.filter((item: any) => item.id !== id)
    });
  };

  const generateLatex = () => {
    // Generate LaTeX code from resume data
    const latex = `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${resumeData.personalInfo.name}} \\\\ \\vspace{1pt}
    \\small ${resumeData.personalInfo.phone} $|$ ${resumeData.personalInfo.email} $|$ ${resumeData.personalInfo.address}
\\end{center}

\\end{document}`;
    setLatexCode(latex);
    setHasGenerated(true);
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
        
        <button className="px-6 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10">
          <Download className="w-4 h-4" />
          Download Resume
        </button>
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
                  
                  <div className="w-full max-w-md border-2 border-dashed border-white/20 rounded-2xl p-12 hover:border-white/50 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-12 h-12 text-slate-500" />
                      <p className="text-sm text-slate-400">
                        <span className="text-white font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500">PDF, DOCX up to 10MB</p>
                    </div>
                  </div>
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
                    <div className="w-full border-2 border-dashed border-white/20 rounded-2xl p-8 hover:border-white/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
                      <div className="p-3 bg-white/5 rounded-full">
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-300 font-medium">Click to upload profile photo</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
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
                          {((resumeData as any)[section.id] as any[]).map((item, idx) => (
                            <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                              <span className="text-sm text-slate-300">Item {idx + 1}</span>
                              <button onClick={() => removeItem(section.id, item.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Generate Button */}
                  <div className="pt-8 space-y-3">
                    <button 
                      onClick={generateLatex}
                      className="w-full px-6 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      Generate Resume
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
                    
                    <button className="px-3 py-1.5 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all text-sm font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Compile
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


        {/* Right Panel - PDF Preview */}
        <div className="glass-card flex flex-col h-full lg:col-span-2 rounded-2xl border border-white/10 overflow-hidden relative backdrop-blur-md bg-[#111111]/90 shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 w-full shrink-0">
            <h2 className="text-xl font-bold text-white mb-1">Resume Preview</h2>
            <p className="text-sm text-slate-400">Live preview of your resume - {resumeData.templateStyle.charAt(0).toUpperCase() + resumeData.templateStyle.slice(1)} style</p>
          </div>
          
          {/* Preview Content */}
          <div className="flex-1 flex items-center justify-center p-6 relative w-full overflow-hidden">
            {hasGenerated ? (
              <div className="w-full max-w-[420px] aspect-[1/1.414] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-xl border border-white/5 flex flex-col relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }} />
                </div>
              </div>
            ) : (
              <div className="text-center z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Preview Yet</h3>
                <p className="text-slate-500 text-sm max-w-[250px] mx-auto">
                  Start filling in your details on the left to see your resume preview here
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
