"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
 *  InteractiveDotGrid
 *
 *  A high-perf canvas-based dot matrix with cursor repulsion.
 *  - ALL rendering via <canvas> + requestAnimationFrame
 *  - Zero DOM nodes for dots
 *  - Spring physics for organic snap-back
 *  - Theme-aware dot colors
 * ───────────────────────────────────────────────────────────── */

// ── Physics tuning knobs ──
const DOT_SPACING = 30;       // px between grid dots
const DOT_RADIUS = 1;         // base dot radius in px
const REPULSE_RADIUS = 120;   // cursor area-of-effect in px
const REPULSE_STRENGTH = 60;  // max push distance in px
const SPRING_STIFFNESS = 0.08; // how fast dots snap back (0–1)
const FRICTION = 0.85;        // velocity damping per frame (0–1)

interface Dot {
  /** Original grid position */
  ox: number;
  oy: number;
  /** Current rendered position */
  x: number;
  y: number;
  /** Velocity for spring physics */
  vx: number;
  vy: number;
}

export function InteractiveDotGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const rafRef = useRef<number>(0);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // ── Build the dot grid whenever the canvas size changes ──
  const buildGrid = useCallback((w: number, h: number) => {
    const dots: Dot[] = [];
    // Start dots at half-spacing offset for a centered look
    const startX = (w % DOT_SPACING) / 2;
    const startY = (h % DOT_SPACING) / 2;

    for (let y = startY; y < h; y += DOT_SPACING) {
      for (let x = startX; x < w; x += DOT_SPACING) {
        dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      }
    }
    dotsRef.current = dots;
  }, []);

  // ── Core animation loop ──
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const mouse = mouseRef.current;
    const dots = dotsRef.current;

    // Determine dot color from current theme
    const isDark = resolvedTheme === "dark";
    const dotColor = isDark
      ? "rgba(210, 220, 240, 0.55)" // cool-white on charcoal
      : "rgba(20, 25, 50, 0.45)";   // charcoal-grey on white

    // ── Clear canvas ──
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = dotColor;

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];

      if (mouse.active) {
        // ── Calculate distance from cursor to dot's ORIGINAL position ──
        const dx = dot.ox - mouse.x;
        const dy = dot.oy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSE_RADIUS && dist > 0) {
          // ── Repulsion force: inverse-linear falloff ──
          // Closer dots get pushed further. The force direction
          // is the unit vector from cursor → dot (away from cursor).
          const force =
            ((REPULSE_RADIUS - dist) / REPULSE_RADIUS) * REPULSE_STRENGTH;

          // Unit vector from cursor to dot
          const ux = dx / dist;
          const uy = dy / dist;

          // Apply repulsion as velocity impulse
          dot.vx += ux * force * 0.15;
          dot.vy += uy * force * 0.15;
        }
      }

      // ── Spring force: pull dot back toward its original grid position ──
      // Hooke's law: F = -k * displacement
      const springX = (dot.ox - dot.x) * SPRING_STIFFNESS;
      const springY = (dot.oy - dot.y) * SPRING_STIFFNESS;

      dot.vx += springX;
      dot.vy += springY;

      // ── Apply friction to prevent infinite oscillation ──
      dot.vx *= FRICTION;
      dot.vy *= FRICTION;

      // ── Integrate velocity into position ──
      dot.x += dot.vx;
      dot.y += dot.vy;

      // ── Draw the dot ──
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [resolvedTheme]);

  // ── Canvas setup & resize handling ──
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      // Set canvas internal resolution to match device pixels
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      // Scale CSS size to match layout
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Scale the context so we draw in CSS pixels
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { w, h };
      buildGrid(w, h);
    };

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas.parentElement!);

    // Start the animation loop
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [mounted, buildGrid, animate]);

  // ── Mouse tracking ──
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999, active: false };
  }, []);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "absolute inset-0 -z-10",
        className
      )}
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
