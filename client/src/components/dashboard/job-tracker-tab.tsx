import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function JobTrackerTab() {
  return (
    <motion.div
      key="jobs"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Job Tracker</h1>
          <p className="text-slate-400">Track your applications and interview stages.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add Application
        </motion.button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-xs uppercase font-semibold text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Date Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white">Google</td>
                <td className="px-6 py-4">Senior UI Engineer</td>
                <td className="px-6 py-4 text-slate-400">May 20, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Interviewing
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-white transition-colors">View</button>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white">Vercel</td>
                <td className="px-6 py-4">Frontend Developer</td>
                <td className="px-6 py-4 text-slate-400">May 18, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Assessment
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-white transition-colors">View</button>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white">Stripe</td>
                <td className="px-6 py-4">React Engineer</td>
                <td className="px-6 py-4 text-slate-400">May 15, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Offer
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-white transition-colors">View</button>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white">OpenAI</td>
                <td className="px-6 py-4">UI/UX Developer</td>
                <td className="px-6 py-4 text-slate-400">May 10, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Applied
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-white transition-colors">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
