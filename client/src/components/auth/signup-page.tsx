"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CanvasRevealEffect } from "@/components/auth/login-page";
import { Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import ROUTES from "@/routes";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/context/toast-context";
import { ApiError } from "@/lib/api";
import { useGoogleSignIn } from "@/hooks/use-google-signin";

function SignupForm() {
  const searchParams = useSearchParams();
  const prefillName = searchParams.get("name") || "";
  const prefillEmail = searchParams.get("email") || "";

  const [name, setName] = useState(prefillName);
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialCanvasVisible] = useState(true);
  const { signup, googleAuth } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const { triggerGoogleSignIn } = useGoogleSignIn(async (credential) => {
    setIsGoogleLoading(true);
    setError("");
    try {
      const profile = await googleAuth(credential);
      if (profile) {
        // User doesn't exist — pre-fill the form
        setName(profile.name || "");
        setEmail(profile.email || "");
        toast.info("Fill in the remaining details to create your account.");
      } else {
        // User already exists, logged in
        toast.success("Signed in with Google!");
        router.push(ROUTES.DASHBOARD);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Google sign-in failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsGoogleLoading(false);
    }
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      await signup(name, email, password);
      toast.success("Account created successfully!");
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong";
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
        href={ROUTES.HOME}
        className="absolute top-8 left-8 z-50 flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all group hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        aria-label="Back to landing page"
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

      {/* Signup Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card w-full">

          <div className="p-8 relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
              <p className="text-sm text-slate-400">Sign up to get started with CareerAI</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 focus:bg-white/10 transition-all backdrop-blur-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
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

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 ml-1">Confirm Password</label>
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
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="mx-4 text-xs text-slate-500 font-medium">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={isGoogleLoading}
                onClick={triggerGoogleSignIn}
                className="group w-full flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all text-sm font-medium text-white disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Sign up with Google
              </motion.button>


            </div>
          </div>

          {/* Footer */}
          <div className="bg-white/5 border-t border-white/10 p-4 text-center relative z-10">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link href={ROUTES.LOGIN} className="relative group text-white/50 hover:text-white font-medium transition-colors inline-block ml-1">
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

export function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-white/50" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
