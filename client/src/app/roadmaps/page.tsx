'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Briefcase, Loader2, Map } from 'lucide-react';
import { GLSLHills } from '@/components/ui/glsl-hills';
import Plan, { Task } from '@/components/ui/agent-plan';
import { cn } from '@/lib/utils';

export default function RoadmapsPage() {
  const [role, setRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tasks, setTasks] = useState<Task[] | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to generate roadmap', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Component */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <GLSLHills width="100%" height="100%" />
      </div>

      {/* Decorative gradient blur */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
          'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
          'blur-[50px] opacity-60 dark:opacity-40 z-0'
        )}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 h-full min-h-screen flex flex-col">
        {/* Header Section */}
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
        </motion.div>

        {/* Input Section */}
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

              {/* Skeleton / Loading State Animation */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 20 }}
                  className="flex flex-col items-center justify-center space-y-4 text-muted-foreground"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-md bg-primary/20 animate-pulse" />
                    <Map className="w-12 h-12 text-primary animate-bounce relative z-10" />
                  </div>
                  <p className="font-medium animate-pulse">Mapping out your journey to become a {role}...</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Results Section */}
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
                <button
                  onClick={() => setTasks(null)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-secondary/50"
                >
                  Start Over
                </button>
              </div>
              
              <div className="flex-1 bg-card/40 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl overflow-hidden">
                <Plan initialTasks={tasks} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
