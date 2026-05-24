import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Eye, Briefcase, TrendingUp, Activity } from "lucide-react";
import StatCard from "./stat-card";
import TimelineItem from "./timeline-item";

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
          value="12"
          trend="+2 this week"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-primary" />}
          label="ATS Pass Rate"
          value="94%"
          trend="+5% improvement"
        />
        <StatCard
          icon={<Eye className="w-5 h-5 text-primary" />}
          label="Profile Views"
          value="1,248"
          trend="+120 this month"
        />
        <StatCard
          icon={<Briefcase className="w-5 h-5 text-primary" />}
          label="Applications"
          value="34"
          trend="4 active processes"
        />
      </div>

      {/* Activity Timeline - Horizontal */}
      <div className="glass-card p-5 lg:p-6 shadow-lg flex-1 flex flex-col">
        <h3 className="text-lg font-extrabold text-white mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Recent Activity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          <TimelineItem
            title="Resume Optimized"
            date="Today, 10:30 AM"
            icon={<FileText className="w-3.5 h-3.5" />}
            status="success"
          />
          <TimelineItem
            title="Mock Interview"
            date="Yesterday, 2:15 PM"
            icon={<Activity className="w-3.5 h-3.5" />}
            status="info"
          />
          <TimelineItem
            title="New Skill Added"
            date="Oct 24, 2023"
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            status="default"
          />
          <TimelineItem
            title="Profile Updated"
            date="Oct 20, 2023"
            icon={<CheckCircle className="w-3.5 h-3.5" />}
            status="success"
          />
        </div>
      </div>
    </motion.div>
  );
}
