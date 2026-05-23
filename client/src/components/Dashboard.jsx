"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FallingPattern } from "@/components/ui/falling-pattern";
import {
  User,
  Mail,
  MapPin,
  Link as LinkIcon,
  FileText,
  Activity,
  Briefcase,
  Eye,
  Settings,
  CheckCircle,
  Loader2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-slate-200 overflow-x-hidden pt-16 pb-10">
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {isClient && (
          <FallingPattern
            className="h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent,#050505)]"
            color="rgba(255, 255, 255, 0.5)"
            backgroundColor="#050505"
          />
        )}
      </div>

      <div className="w-full mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar / Left Column */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 flex flex-col items-center text-center shadow-lg"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-white/10 flex items-center justify-center mb-4 overflow-hidden relative group">
                <User className="w-12 h-12 text-white/50" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <span className="text-xs font-semibold text-white">Edit</span>
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Alex Carter</h2>
              <p className="text-sm text-primary font-medium mb-4">Senior Frontend Developer</p>

              <div className="w-full space-y-3 text-sm text-slate-400 text-left mt-4 border-t border-white/10 pt-5">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>alex@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-4 h-4 text-slate-500" />
                  <a href="#" className="hover:text-primary transition-colors">github.com/alexcarter</a>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card p-2 flex flex-col gap-1 shadow-lg"
            >
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                  activeTab === "overview"
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Activity className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                  activeTab === "settings"
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
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
                        icon={<CheckCircle className="w-3.5 h-3.5" />}
                        status="default"
                      />
                      <TimelineItem
                        title="Profile Created"
                        date="Oct 20, 2023"
                        icon={<User className="w-3.5 h-3.5" />}
                        status="default"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-card p-6 lg:p-8 shadow-lg">
                    <h3 className="text-2xl font-extrabold text-white mb-8 tracking-tight">Profile Settings</h3>

                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">First Name</label>
                          <input
                            type="text"
                            defaultValue="Alex"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Last Name</label>
                          <input
                            type="text"
                            defaultValue="Carter"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Mail className="h-4 w-4 text-slate-400" />
                          </div>
                          <input
                            type="email"
                            defaultValue="alex@example.com"
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Professional Role</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Briefcase className="h-4 w-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            defaultValue="Senior Frontend Developer"
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Bio</label>
                        <textarea
                          rows={4}
                          defaultValue="Passionate frontend developer with 5+ years of experience building highly interactive web applications using React, Next.js, and Three.js."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm resize-none leading-relaxed"
                        />
                      </div>

                      <div className="pt-6 flex justify-end">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={isSaving}
                          className="py-3 px-8 bg-white/90 text-black font-semibold rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <Loader2 className="animate-spin mr-2 h-5 w-5 text-black" />
                          ) : (
                            "Save Changes"
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-6 group flex flex-col gap-4 transition-all hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white tracking-tight mb-1">{value}</p>
        <h4 className="text-sm text-slate-400 font-medium">{label}</h4>
      </div>
      <div className="mt-auto pt-4 border-t border-white/5">
        <p className="text-xs font-medium text-primary/90">{trend}</p>
      </div>
    </motion.div>
  );
}

function TimelineItem({ title, date, icon, status }) {
  const getStatusColor = () => {
    switch (status) {
      case "success": return "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
      case "info": return "bg-blue-500/10 border-blue-500/50 text-blue-400";
      default: return "bg-white/5 border-white/20 text-slate-300";
    }
  };

  return (
    <div className="glass-card p-4 hover:bg-white/10 transition-colors shadow-sm border-white/5 group hover:border-white/10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={cn("w-7 h-7 rounded-full border flex items-center justify-center shrink-0", getStatusColor())}>
          {icon}
        </div>
        <h4 className="font-bold text-white text-sm leading-snug">{title}</h4>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Calendar className="w-3 h-3" />
        <span>{date}</span>
      </div>
    </div>
  );
}
