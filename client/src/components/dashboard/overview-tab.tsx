import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Eye, Briefcase, TrendingUp, Activity } from "lucide-react";
import StatCard from "./stat-card";

export default function OverviewTab() {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 flex-1"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="w-5 h-5 text-primary" />}
          label="Resumes Built"
          value="0"
          trend="Start building!"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-primary" />}
          label="ATS Pass Rate"
          value="—"
          trend="Check your resume"
        />
        <StatCard
          icon={<Eye className="w-5 h-5 text-primary" />}
          label="Profile Views"
          value="0"
          trend="Complete your profile"
        />
        <StatCard
          icon={<Briefcase className="w-5 h-5 text-primary" />}
          label="Applications"
          value="0"
          trend="Track your jobs"
        />
      </div>

      {/* Empty state */}
      <div className="glass-card p-8 lg:p-10 shadow-lg flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Activity Yet</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Start by building your resume, checking your ATS score, or preparing for interviews. Your recent activity will appear here.
        </p>
      </div>
    </motion.div>
  );
}
