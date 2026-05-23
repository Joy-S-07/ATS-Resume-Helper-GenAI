import React from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Link as LinkIcon } from "lucide-react";

export default function SidebarProfile({ profile, links }) {
  return (
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
      <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">{profile.firstName} {profile.lastName}</h2>
      <p className="text-sm text-primary font-medium mb-4">{profile.role}</p>

      <div className="w-full space-y-3 text-sm text-slate-400 text-left mt-4 border-t border-white/10 pt-5">
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-slate-500" />
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-slate-500" />
          <span>{profile.location}</span>
        </div>
        {links.slice(0, 1).map((link) => (
          <div key={link.id} className="flex items-center gap-3">
            <LinkIcon className="w-4 h-4 text-slate-500" />
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors truncate">
              {link.url.replace(/^https?:\/\//, '')}
            </a>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
