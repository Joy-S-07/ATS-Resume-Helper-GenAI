"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden py-10 md:py-20">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-foreground mb-4">
              Unlock Your Potential with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-primary">
                AI Resume Analysis
              </span>
            </h1>
          </>
        }
      >
        <div className="group relative w-full h-full overflow-hidden rounded-2xl bg-white shadow-inner">
          {/* Browser Header Overlay (Brave-like) */}
          <div className="absolute top-0 left-0 w-full bg-[#35363A] text-white p-2 flex items-center gap-2 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 shadow-md">
            {/* Mac window controls */}
            <div className="flex gap-1.5 px-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            {/* URL bar */}
            <div className="flex-1 bg-[#202124] rounded-md px-4 py-1.5 text-xs text-gray-400 font-mono text-center overflow-hidden text-ellipsis whitespace-nowrap mx-4 border border-white/5">
              https://careerai.app/vicky-resume.pdf
            </div>
            <div className="w-10"></div>
          </div>
          
          <Image
            src="/vickyResume.webp"
            alt="hero resume"
            height={1200}
            width={800}
            className="mx-auto object-cover h-full w-full object-top"
            draggable={false}
          />
          
          {/* Placement Confirmed Stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 3, rotate: -25 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -15 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 150, damping: 12 }}
            viewport={{ once: true, margin: "50px" }}
            className="absolute bottom-10 right-4 md:bottom-20 md:right-10 pointer-events-none z-50"
          >
            <div className="border-8 border-red-500 text-red-500 text-3xl md:text-5xl font-black uppercase px-6 py-3 rounded-xl backdrop-blur-sm bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              Placement<br />Confirmed
            </div>
          </motion.div>
        </div>
      </ContainerScroll>
    </div>
  );
}
