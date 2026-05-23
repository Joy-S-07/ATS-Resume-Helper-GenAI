"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600", "700"] });

export function Footer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const hoverSvgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fitWatermark = () => {
      if (!svgRef.current || !textRef.current || !hoverSvgRef.current) return;
      try {
        const bbox = textRef.current.getBBox();
        const viewBoxStr = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
        svgRef.current.setAttribute("viewBox", viewBoxStr);
        hoverSvgRef.current.setAttribute("viewBox", viewBoxStr);
      } catch (e) {}
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitWatermark);
    } else {
      setTimeout(fitWatermark, 500);
    }

    window.addEventListener("resize", fitWatermark);
    return () => window.removeEventListener("resize", fitWatermark);
  }, []);

  return (
    <section className="bg-background pt-12 pb-6 px-4 md:px-6 overflow-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 items-stretch">
        {/* LEFT CARD */}
        <div className="relative min-h-[340px] rounded-[28px] p-8 overflow-hidden flex flex-col justify-between shadow-[0_12px_40px_rgba(249,115,22,0.25)] bg-[#f97316]">
          <div className="absolute inset-0 bg-[#f97316] mix-blend-color z-10 pointer-events-none opacity-100" />
          <video
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4"
              type="video/mp4"
            />
          </video>

          <div className="relative z-20 flex flex-row gap-2.5 items-center group cursor-default">
            <div className="w-8 h-8 rounded-lg bg-white/15 border-[1.5px] border-white/85 flex items-center justify-center font-bold text-white text-base tracking-[-0.02em] group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              C
            </div>
            <span className="font-bold text-white text-[22px] tracking-[-0.02em] group-hover:text-primary transition-colors duration-300">
              CareerAI
            </span>
          </div>

          <div className="relative z-20 mt-auto mb-7">
            <p className="text-[19px] font-normal text-white leading-[1.45]">
              Smarter resume building,<br />
              <span className="text-white/65">powered by AI.</span>
            </p>
          </div>

          <div className="relative z-20 flex flex-row justify-between items-center gap-3">
            <span
              className={`${caveat.className} text-[17px] font-semibold text-white/90 tracking-[0.3px]`}
            >
              Developer:
            </span>
            <div className="flex flex-row gap-[7px]">
              {[
                {
                  name: "LinkedIn",
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  href: "https://linkedin.com/in/beinggojo"
                },
                {
                  name: "GitHub",
                  path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
                  href: "https://github.com/Joy-S-07"
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-[9px] bg-[#0e1014] flex items-center justify-center shadow-[0_6px_18px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:bg-black hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[15px] h-[15px] fill-white group-hover:scale-110 transition-transform"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative rounded-[28px] p-6 sm:p-10 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.2)] bg-card border border-white/5 mt-10 lg:mt-0">
          {/* Floating Lucky Badge */}
          <div className="absolute -top-7 right-3 sm:-top-9 sm:right-10 z-10 flex flex-col items-start gap-1.5">
            <div className="w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-[22px] -rotate-12 bg-gradient-to-br from-primary/80 via-primary to-blue-700 shadow-[inset_3px_3px_8px_rgba(255,255,255,0.35),inset_-3px_-3px_12px_rgba(0,0,0,0.18),8px_14px_28px_rgba(0,0,0,0.35)] flex items-center justify-center">
              <span className="font-bold text-white text-[32px] sm:text-[42px] tracking-[-0.04em] rotate-12 drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)] leading-none">
                C
              </span>
            </div>
            <div className="flex flex-row gap-1.5 items-center -rotate-3 mt-1">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-muted-foreground stroke-current fill-none stroke-2 stroke-[round] stroke-linejoin-[round]"
              >
                <path d="M3 20 C 6 14, 10 9, 18 5" />
                <path d="M18 5 L 12 5" />
                <path d="M18 5 L 18 11" />
              </svg>
              <span
                className={`${caveat.className} text-[18px] sm:text-[20px] font-semibold text-muted-foreground whitespace-nowrap`}
              >
                Need an edge?
              </span>
            </div>
          </div>

          {/* Top: Nav Columns */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-[72px] pt-2 md:max-w-[60%] flex-wrap">
            <div className="flex flex-col">
              <h3
                className={`${caveat.className} text-[24px] font-semibold italic text-muted-foreground mb-[18px]`}
              >
                Navigation
              </h3>
              <div className="flex flex-col gap-3.5">
                {["How it works", "Features", "Pricing", "Testimonials", "FAQ"].map(
                  (link) => (
                    <Link
                      key={link}
                      href="#"
                      className="text-[14px] font-semibold text-foreground/80 hover:text-primary transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <h3
                className={`${caveat.className} text-[24px] font-semibold italic text-muted-foreground mb-[18px]`}
              >
                Company
              </h3>
              <div className="flex flex-col gap-3.5">
                {["Blog", "About", "Terms and Condition", "Privacy Policy"].map(
                  (link) => (
                    <Link
                      key={link}
                      href="#"
                      className="text-[14px] font-semibold text-foreground/80 hover:text-primary transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mt-12 gap-6">
            <div className="text-[12.5px] font-medium text-muted-foreground order-2 lg:order-1">
              © 2026 CareerAI. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* WATERMARK */}
      <div
        ref={watermarkRef}
        onMouseMove={(e) => {
          if (!watermarkRef.current) return;
          const rect = watermarkRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          watermarkRef.current.style.setProperty("--mouse-x", `${x}px`);
          watermarkRef.current.style.setProperty("--mouse-y", `${y}px`);
        }}
        className="w-full mt-10 lg:mt-[-60px] select-none relative z-0 leading-none group cursor-pointer"
        aria-hidden="true"
      >
        <svg
          ref={svgRef}
          id="watermarkSvg"
          viewBox="62 95 876 175"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-auto overflow-visible"
        >
          <text
            ref={textRef}
            id="watermarkText"
            x="500"
            y="240"
            textAnchor="middle"
            fontSize="320"
            className="font-sans font-bold tracking-[-0.03em] fill-white/[0.03]"
          >
            CareerAI
          </text>
        </svg>

        {/* Hover Tracking Layer */}
        <svg
          ref={hoverSvgRef}
          viewBox="62 95 876 175"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 block w-full h-auto overflow-visible opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            WebkitMaskImage: `radial-gradient(circle 250px at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)`,
            maskImage: `radial-gradient(circle 250px at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)`,
          }}
        >
          <text
            x="500"
            y="240"
            textAnchor="middle"
            fontSize="320"
            fill="#f97316"
            className="font-sans font-bold tracking-[-0.03em] drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]"
          >
            CareerAI
          </text>
        </svg>
      </div>
    </section>
  );
}
