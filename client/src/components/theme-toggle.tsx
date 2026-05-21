"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type MouseEvent,
} from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────────────────────
 *  Dot-Matrix SVG Pattern
 *  Rendered inside the expanding clip-path overlay for depth.
 * ──────────────────────────────────────────────────────────── */
function DotMatrixPattern({ isDarkTarget }: { isDarkTarget: boolean }) {
  const dotColor = isDarkTarget
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.04)";

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full"
      style={{ willChange: "transform, opacity" }}
      initial={{ opacity: 0, scale: 1.15 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.25, ease: "easeOut" },
        scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dot-matrix"
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill={dotColor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-matrix)" />
    </motion.svg>
  );
}

/* ────────────────────────────────────────────────────────────
 *  Theme Toggle Component
 *  - Captures exact clientX/clientY from the click event
 *  - Radial clip-path expansion with SVG dot-matrix overlay
 *  - GPU-only animation (clip-path, transform, opacity)
 *  - Syncs next-themes swap behind the animation mask
 * ──────────────────────────────────────────────────────────── */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Animation state stored in a ref to avoid re-renders during animation
  const [overlay, setOverlay] = useState<{
    x: number;
    y: number;
    radius: number;
    bgColor: string;
    isDarkTarget: boolean;
  } | null>(null);

  const isAnimating = useRef(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const handleToggle = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (isAnimating.current) return;

      // ── 1. Capture exact mouse click coordinates ──
      const x = e.clientX;
      const y = e.clientY;

      // ── 2. Compute max radius to cover entire viewport ──
      const maxX = Math.max(x, window.innerWidth - x);
      const maxY = Math.max(y, window.innerHeight - y);
      const radius = Math.ceil(Math.hypot(maxX, maxY)) + 40;

      // ── 3. Determine the NEW theme ──
      const newTheme = isDark ? "light" : "dark";
      const isDarkTarget = newTheme === "dark";

      // Overlay bg = the NEW theme's background color
      const bgColor = isDarkTarget
        ? "hsl(240, 10%, 3.9%)"
        : "hsl(0, 0%, 100%)";

      isAnimating.current = true;
      setOverlay({ x, y, radius, bgColor, isDarkTarget });

      // ── 4. Swap theme behind the mask after a brief delay ──
      // The overlay is already expanding, hiding the DOM swap.
      requestAnimationFrame(() => {
        setTimeout(() => setTheme(newTheme), 30);
      });
    },
    [isDark, setTheme]
  );

  const handleAnimationComplete = useCallback(() => {
    isAnimating.current = false;
    setOverlay(null);
  }, []);

  return (
    <>
      {/* ── Toggle Button with rotating icon ── */}
      <Button
        ref={buttonRef}
        onClick={handleToggle}
        size="icon"
        variant="ghost"
        aria-label="Toggle theme"
        className="relative overflow-hidden cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          {mounted && isDark ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex items-center justify-center"
              style={{ willChange: "transform, opacity" }}
            >
              <Sun className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex items-center justify-center"
              style={{ willChange: "transform, opacity" }}
            >
              <Moon className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* ── Radial Clip-Path Wipe Overlay ── */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            key="theme-overlay"
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{
              background: overlay.bgColor,
              willChange: "clip-path",
            }}
            initial={{
              clipPath: `circle(0% at ${overlay.x}px ${overlay.y}px)`,
            }}
            animate={{
              clipPath: `circle(${overlay.radius}px at ${overlay.x}px ${overlay.y}px)`,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              clipPath: {
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            onAnimationComplete={handleAnimationComplete}
          >
            {/* Dot-Matrix pattern with depth animation */}
            <DotMatrixPattern isDarkTarget={overlay.isDarkTarget} />

            {/* Radial gradient halo from origin point for extra depth */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${overlay.x}px ${overlay.y}px, ${
                  overlay.isDarkTarget
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)"
                } 0%, transparent 60%)`,
                willChange: "transform, opacity",
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
