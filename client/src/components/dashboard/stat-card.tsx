import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}

export default function StatCard({ icon, label, value, trend }: StatCardProps) {
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
