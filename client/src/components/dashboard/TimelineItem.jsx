import React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TimelineItem({ title, date, icon, status }) {
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
