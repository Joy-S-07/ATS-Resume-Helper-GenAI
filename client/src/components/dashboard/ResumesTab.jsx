import React from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Trash2, Plus } from "lucide-react";

export default function ResumesTab() {
  return (
    <motion.div
      key="resumes"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">My Resumes</h1>
          <p className="text-slate-400">Manage and tailor your ATS-friendly resumes.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Create New
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resume Card 1 */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 group flex flex-col justify-between h-56 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <button className="p-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all text-white"><Eye className="w-4 h-4" /></button>
              <button className="p-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Frontend Engineer</h3>
            <p className="text-xs text-slate-400">Updated 2 days ago</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium">
            <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">ATS Score: 92%</span>
            <span className="text-slate-500">Tailored</span>
          </div>
        </motion.div>

        {/* Resume Card 2 */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 group flex flex-col justify-between h-56 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <button className="p-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all text-white"><Eye className="w-4 h-4" /></button>
              <button className="p-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Fullstack Developer</h3>
            <p className="text-xs text-slate-400">Updated 1 week ago</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium">
            <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">ATS Score: 88%</span>
            <span className="text-slate-500">General</span>
          </div>
        </motion.div>

        {/* Create New Card */}
        <motion.div whileHover={{ scale: 0.98 }} className="border-2 border-dashed border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col items-center justify-center h-56 transition-all cursor-pointer bg-white/[0.02] hover:bg-white/[0.05]">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm font-semibold text-white">Create New Resume</p>
          <p className="text-xs text-slate-400 mt-1">Start from scratch or import</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
