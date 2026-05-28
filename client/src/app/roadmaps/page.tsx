'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Loader2,
  Map,
  History,
  Trash2,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';
import Plan, { Task } from '@/components/ui/agent-plan';
import { cn } from '@/lib/utils';

interface SavedRoadmap {
  _id: string;
  role: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export default function RoadmapsPage() {
  const [role, setRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  // ── Fetch saved roadmaps on mount ──────────────────────────────────────────
  const fetchSavedRoadmaps = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/roadmap', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSavedRoadmaps(data.roadmaps || []);
      }
    } catch {
      // silently fail — user may not be logged in
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedRoadmaps();
  }, [fetchSavedRoadmaps]);

  // ── Generate new roadmap ───────────────────────────────────────────────────
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate roadmap. Please try again.');
        return;
      }

      setTasks(data.tasks);
      setCurrentRoadmapId(data.roadmapId || null);
      // Refresh history list
      fetchSavedRoadmaps();
    } catch {
      setError('Network error. Make sure the server is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Save progress (task status updates) ───────────────────────────────────
  const handleSaveProgress = async (updatedTasks: Task[]) => {
    if (!currentRoadmapId) return;

    setIsSavingProgress(true);
    try {
      await fetch(`/api/roadmap/${currentRoadmapId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tasks: updatedTasks }),
      });
      fetchSavedRoadmaps();
    } catch {
      // non-critical — don't show error for background saves
    } finally {
      setIsSavingProgress(false);
    }
  };

  // ── Load a saved roadmap ───────────────────────────────────────────────────
  const handleLoadRoadmap = (roadmap: SavedRoadmap) => {
    setRole(roadmap.role);
    setTasks(roadmap.tasks);
    setCurrentRoadmapId(roadmap._id);
    setShowHistory(false);
    setError(null);
  };

  // ── Delete a saved roadmap ─────────────────────────────────────────────────
  const handleDeleteRoadmap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/roadmap/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setSavedRoadmaps((prev) => prev.filter((r) => r._id !== id));
        if (currentRoadmapId === id) {
          setTasks(null);
          setCurrentRoadmapId(null);
        }
      }
    } catch {
      // silently fail
    }
  };

  // ── Reset to input form ────────────────────────────────────────────────────
  const handleStartOver = () => {
    setTasks(null);
    setCurrentRoadmapId(null);
    setRole('');
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <GLSLHills width="100%" height="100%" />
      </div>

      {/* Decorative gradient */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
          'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
          'blur-[50px] opacity-60 dark:opacity-40 z-0'
        )}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 h-full min-h-screen flex flex-col">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="text-center mb-12 mt-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-6 ring-1 ring-primary/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">AI-Powered Career Paths</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Build Your Career Roadmap
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us the role you want to master, and our AI will generate a comprehensive step-by-step roadmap tailored for your success.
          </p>

          {/* History toggle */}
          {savedRoadmaps.length > 0 && !tasks && (
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-secondary/50"
            >
              <History className="w-4 h-4" />
              {showHistory ? 'Hide' : 'View'} saved roadmaps ({savedRoadmaps.length})
            </button>
          )}
        </motion.div>

        {/* ── Saved Roadmaps History ──────────────────────────────────────── */}
        <AnimatePresence>
          {showHistory && !tasks && (
            <motion.div
              key="history"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto w-full mb-8 overflow-hidden"
            >
              <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-3">
                  Your Saved Roadmaps
                </p>
                {isLoadingHistory ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  savedRoadmaps.map((roadmap) => (
                    <motion.button
                      key={roadmap._id}
                      onClick={() => handleLoadRoadmap(roadmap)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Map className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{roadmap.role}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(roadmap.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {' · '}
                            {roadmap.tasks.length} tasks
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteRoadmap(roadmap._id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                        title="Delete roadmap"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input / Results ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {!tasks && (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto w-full"
            >
              <form
                onSubmit={handleGenerate}
                className="relative flex items-center p-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-primary/30"
              >
                <div className="pl-4 pr-2 text-muted-foreground">
                  <Briefcase className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer, Data Scientist..."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg px-2 py-4 text-foreground placeholder:text-muted-foreground/60"
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={isGenerating || !role.trim()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:scale-100"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating</span>
                    </>
                  ) : (
                    <>
                      <span>Create</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Loading animation */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 20 }}
                  className="flex flex-col items-center justify-center space-y-4 text-muted-foreground mt-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-md bg-primary/20 animate-pulse" />
                    <Map className="w-12 h-12 text-primary animate-bounce relative z-10" />
                  </div>
                  <p className="font-medium animate-pulse">
                    Mapping out your journey to become a {role}...
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── Roadmap Results ─────────────────────────────────────────── */}
          {tasks && (
            <motion.div
              key="roadmap-results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 w-full max-w-4xl mx-auto flex flex-col h-[600px]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Map className="w-6 h-6 text-primary" />
                  Roadmap for {role}
                </h2>

                <div className="flex items-center gap-3">
                  {/* Save progress indicator */}
                  {isSavingProgress && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Saving…
                    </span>
                  )}

                  {/* Save progress button (only if we have a DB id) */}
                  {currentRoadmapId && (
                    <button
                      onClick={() => tasks && handleSaveProgress(tasks)}
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-lg hover:bg-primary/10"
                    >
                      Save Progress
                    </button>
                  )}

                  <button
                    onClick={handleStartOver}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-secondary/50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Start Over
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-card/40 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl overflow-hidden">
                <Plan
                  initialTasks={tasks}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
