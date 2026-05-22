"use client";

import { MoveRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { InteractiveDotGrid } from "@/components/ui/interactive-dot-grid";
import Link from "next/link";
import { motion } from "framer-motion";

function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Interactive canvas-based dot grid */}
      <InteractiveDotGrid />

      <div className="container mx-auto">
        <motion.div 
          className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col relative z-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Button variant="secondary" size="sm" className="gap-4" asChild>
              <Link href="#ats">
                AI-Powered Resume Analysis <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
          
          <div className="flex gap-4 flex-col items-center">
            <motion.h1 variants={item} className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              Make your resume
            </motion.h1>

            {/* GooeyText morphing animation as the hero's centerpiece */}
            <motion.div variants={item} className="h-[80px] md:h-[120px] flex items-center justify-center w-full">
              <GooeyText
                texts={["ATS-Ready", "Optimized", "Interview-Proof", "Career-Winning", "AI-Powered"]}
                morphTime={1}
                cooldownTime={0.25}
                className="font-bold"
                textClassName="text-5xl md:text-7xl tracking-tighter"
              />
            </motion.div>

            <motion.p variants={item} className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Upload your resume and instantly get your ATS compatibility score,
              AI-generated interview questions tailored to your role, and a
              personalized career roadmap — all in one platform.
            </motion.p>
          </div>

          <motion.div variants={item} className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline" asChild>
              <Link href="#ats">
                Check ATS Score <Upload className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-4" asChild>
              <Link href="/register">
                Get Started Free <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export { Hero };
