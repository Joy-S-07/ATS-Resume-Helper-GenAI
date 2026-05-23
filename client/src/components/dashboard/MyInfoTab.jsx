import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, MapPin, Briefcase, CheckCircle, X, Plus, GraduationCap, Link as LinkIcon, Trash2, Loader2 } from "lucide-react";

export default function MyInfoTab({
  formData,
  setFormData,
  handleSave,
  isSaving,
  skills,
  newSkill,
  setNewSkill,
  showSuggestions,
  setShowSuggestions,
  filteredSuggestions,
  addSkill,
  removeSkill,
  experiences,
  addExperience,
  removeExperience,
  updateExperience,
  education,
  addEducation,
  removeEducation,
  updateEducation,
  links,
  addLink,
  removeLink,
  updateLink,
}) {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {/* Personal Info */}
      <div className="glass-card p-5 lg:p-6 shadow-lg">
        <h3 className="text-lg font-extrabold text-white mb-4 tracking-tight flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Personal Info
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">First Name</label>
              <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Last Name</label>
              <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Professional Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Experience Level</label>
              <select value={formData.experienceLevel} onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                <option className="bg-[#111]" value="junior">Junior (0-2 years)</option>
                <option className="bg-[#111]" value="mid">Mid-Level (2-5 years)</option>
                <option className="bg-[#111]" value="senior">Senior (5-8 years)</option>
                <option className="bg-[#111]" value="lead">Lead / Staff (8+ years)</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-wider uppercase text-slate-400 ml-1">Bio</label>
            <textarea rows={2} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all resize-none leading-relaxed" />
          </div>
        </form>
      </div>

      {/* Skills, Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Skills with Autocomplete */}
        <div className="glass-card p-5 lg:p-6 shadow-lg">
          <h3 className="text-lg font-extrabold text-white mb-4 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <motion.span
                key={skill}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:border-white/20 transition-colors group"
              >
                {skill}
                <button onClick={() => removeSkill(skill)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-slate-400 hover:text-red-400" />
                </button>
              </motion.span>
            ))}
          </div>
          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => { setNewSkill(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Add a skill..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addSkill()}
                className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute z-20 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  {filteredSuggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      onMouseDown={() => addSkill(suggestion)}
                      className="px-4 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {suggestion}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Links */}
        <div className="glass-card p-5 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              Links
            </h3>
            <button onClick={addLink} className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-3 h-3" /> Add Link
            </button>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {links.map((link) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl group relative"
              >
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => updateLink(link.id, "name", e.target.value)}
                  placeholder="Name"
                  className="w-1/3 px-3 py-1.5 bg-transparent border-r border-white/10 text-white text-sm focus:outline-none placeholder-slate-500"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-3 py-1.5 bg-transparent text-white text-sm focus:outline-none placeholder-slate-500"
                />
                <button onClick={() => removeLink(link.id)} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded-lg">
                  <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Experience */}
        <div className="glass-card p-5 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Experience
            </h3>
            <button onClick={addExperience} className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-3 h-3" /> Add Experience
            </button>
          </div>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 group relative"
              >
                {experiences.length > 1 && (
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                  </button>
                )}
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                  placeholder="Job Title"
                  className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    placeholder="Company"
                    className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                    placeholder="Duration (e.g. 2021-Present)"
                    className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="glass-card p-5 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Education
            </h3>
            <button onClick={addEducation} className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-3 h-3" /> Add Education
            </button>
          </div>
          <div className="space-y-3">
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 group relative"
              >
                {education.length > 1 && (
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                  </button>
                )}
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                  placeholder="Degree"
                  className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    placeholder="Institution"
                    className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                    placeholder="Year"
                    className="w-full px-3 py-1.5 bg-transparent border-b border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder-slate-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={isSaving}
          className="py-2.5 px-8 bg-white/90 text-black font-semibold rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed text-sm"
        >
          {isSaving ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4 text-black" />
          ) : (
            "Save Changes"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
