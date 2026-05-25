"use client";

import ATSScoreChecker from "@/components/ats-checker/ats-score-checker";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { GLSLHills } from "@/components/ui/glsl-hills";

export default function ATSCheckerPage() {
  return (
    <div className="min-h-screen bg-[#050505] w-full flex flex-col items-center pb-20 relative">
      
      {/* Background Component */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <GLSLHills className="w-full h-full" width="100%" height="100%" />
      </div>

      {/* 3D Robot Hero Section */}
      <Card className="w-full h-[calc(100vh-64px)] bg-black/[0.96] relative overflow-hidden border-none rounded-none rounded-b-3xl z-10">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        
        <div className="flex h-full w-full">
          {/* Left content */}
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
              AI-Powered <br /> ATS Scoring
            </h1>
            <p className="mt-6 text-neutral-300 max-w-lg text-lg">
              Bring your resume to life with our intelligent 3D-assisted analyzer. Create impactful applications that capture attention and pass automated screenings.
            </p>
          </div>

          {/* Right content */}
          <div className="flex-1 relative hidden lg:block">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/50 z-20">
          <span className="text-xs font-semibold tracking-widest uppercase mb-2">Scroll to check</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </Card>

      {/* Main Tool Area */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full px-6 relative z-20"
      >
        <ATSScoreChecker />
      </motion.div>
    </div>
  );
}
