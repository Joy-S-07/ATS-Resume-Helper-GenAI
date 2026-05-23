"use client";

import { cn } from "@/lib/utils";

/**
 * AnimatedDotPattern
 *
 * A precise, sparse matrix grid of highly visible dots.
 * - Single SVG with <pattern> — zero individual DOM elements.
 * - CSS @keyframes breathing pulse (GPU-composited opacity only).
 * - Dark mode: bright cool-white dots on charcoal-black.
 * - Light mode: crisp dark-grey dots on pure white.
 */
export function AnimatedDotPattern({
  className,
  dotSpacing = 30,
  dotRadius = 1,
}: {
  className?: string;
  dotSpacing?: number;
  dotRadius?: number;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 pointer-events-none overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Breathing pulse — GPU-composited opacity only */}
      <svg
        className="absolute inset-0 h-full w-full animate-dot-breathe"
        style={{ willChange: "opacity" }}
      >
        <defs>
          {/* Dark-mode dots: bright cool-white light points */}
          <pattern
            id="dot-grid-dark"
            x="0"
            y="0"
            width={dotSpacing}
            height={dotSpacing}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={dotSpacing / 2}
              cy={dotSpacing / 2}
              r={dotRadius}
              fill="rgba(210, 220, 240, 0.55)"
            />
          </pattern>

          {/* Light-mode dots: crisp charcoal-grey points */}
          <pattern
            id="dot-grid-light"
            x="0"
            y="0"
            width={dotSpacing}
            height={dotSpacing}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={dotSpacing / 2}
              cy={dotSpacing / 2}
              r={dotRadius}
              fill="rgba(20, 25, 50, 0.45)"
            />
          </pattern>
        </defs>

        {/* Light mode fill — hidden in dark mode */}
        <rect
          width="100%"
          height="100%"
          fill="url(#dot-grid-light)"
          className="dark:opacity-0 opacity-100 transition-opacity duration-300"
        />

        {/* Dark mode fill — hidden in light mode */}
        <rect
          width="100%"
          height="100%"
          fill="url(#dot-grid-dark)"
          className="dark:opacity-100 opacity-0 transition-opacity duration-300"
        />
      </svg>
    </div>
  );
}
