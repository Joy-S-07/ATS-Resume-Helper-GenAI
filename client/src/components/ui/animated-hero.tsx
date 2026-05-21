"use client";

import { MoveRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { AnimatedDotPattern } from "@/components/ui/animated-dot-pattern";
import Link from "next/link";

function Hero() {
  return (
    <div className="w-full relative">
      {/* Animated dot-matrix background */}
      <AnimatedDotPattern />

      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4" asChild>
              <Link href="#ats">
                AI-Powered Resume Analysis <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="flex gap-4 flex-col items-center">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              Make your resume
            </h1>

            {/* GooeyText morphing animation as the hero's centerpiece */}
            <div className="h-[80px] md:h-[120px] flex items-center justify-center w-full">
              <GooeyText
                texts={["ATS-Ready", "Optimized", "Interview-Proof", "Career-Winning", "AI-Powered"]}
                morphTime={1}
                cooldownTime={0.25}
                className="font-bold"
                textClassName="text-5xl md:text-7xl tracking-tighter"
              />
            </div>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Upload your resume and instantly get your ATS compatibility score,
              AI-generated interview questions tailored to your role, and a
              personalized career roadmap — all in one platform.
            </p>
          </div>
          <div className="flex flex-row gap-3">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
