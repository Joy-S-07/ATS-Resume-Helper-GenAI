"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CanvasRevealEffect } from "@/components/auth/login-page";
import { Lock, ArrowRight, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import ROUTES from "@/routes";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/context/toast-context";
import { ApiError } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const { resetPassword } = useAuth();
  const toast = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialCanvasVisible] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      const msg = "Invalid or missing reset token";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 overflow-hidden text-slate-200">
      {/* Back Button */}
      <Link
        href={ROUTES.LOGIN}
        className="absolute top-8 left-8 z-50 flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all group hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        aria-label="Back to login"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-black"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={2}
              reverse={false}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card w-full">
          <div className="p-8 relative z-10">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                      Set New Password
                    </h1>
                    <p className="text-sm text-slate-400">
                      Enter your new password below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                        <svg
                          className="w-4 h-4 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {error}
                      </div>
                    )}

                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 ml-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Lock className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 ml-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Lock className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 py-2.5 px-4 bg-white/90 text-black font-medium rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin mr-2 h-5 w-5 text-black" />
                      ) : (
                        <>
                          Reset Password
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                  className="text-center py-4"
                >
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur-xl bg-emerald-500/20 animate-pulse" />
                      <CheckCircle className="w-16 h-16 text-emerald-400 relative z-10" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Password Reset!
                  </h2>
                  <p className="text-sm text-slate-400 mb-6">
                    Your password has been successfully reset. You can now sign
                    in with your new password.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push(ROUTES.LOGIN)}
                    className="w-full py-2.5 px-4 bg-white/90 text-black font-medium rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all flex items-center justify-center group"
                  >
                    Go to Sign In
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-white/5 border-t border-white/10 p-4 text-center relative z-10">
            <p className="text-xs text-slate-400">
              Remember your password?{" "}
              <Link
                href={ROUTES.LOGIN}
                className="relative group text-white/50 hover:text-white font-medium transition-colors inline-block ml-1"
              >
                <span>Sign in</span>
                <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-white/70 scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-white/50" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
