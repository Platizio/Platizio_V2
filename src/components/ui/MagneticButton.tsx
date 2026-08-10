"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { SPRING_CONFIG, SPRING_SNAP } from "@/lib/motion";

const variants = {
  brass:
    "bg-brass text-midnight hover:bg-brass/90 border border-transparent",
  "outline-light":
    "border border-lavender/30 text-lavender hover:border-lavender/70",
  "outline-dark": "border border-ink/25 text-ink hover:border-ink/70",
  violet: "bg-violet text-porcelain hover:bg-violet/90 border border-transparent",
} as const;

/** How far the button is allowed to lean toward the pointer, as a fraction. */
const PULL = 0.28;

/**
 * Magnetic CTA — leans toward the pointer within its bounds, and reacts on
 * press-down rather than on release.
 *
 * X and Y run as two independent springs. A single spring driving 2D distance
 * desyncs the moment the pointer's horizontal and vertical speeds differ, which
 * shows up as the button drifting off the cursor's line.
 */
export function MagneticButton({
  children,
  href,
  variant = "brass",
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: keyof typeof variants;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Springs re-target from wherever they currently are, so flicking the pointer
  // across the button reverses the lean mid-flight instead of restarting it.
  const sx = useSpring(x, SPRING_CONFIG);
  const sy = useSpring(y, SPRING_CONFIG);

  function onMove(e: React.PointerEvent) {
    if (reduce || !ref.current || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * PULL);
    y.set((e.clientY - (r.top + r.height / 2)) * PULL);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const cls = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-medium tracking-wide transition-colors duration-hover ${variants[variant]} ${className}`;

  // whileTap fires on pointer-down, so the press reads immediately rather than
  // waiting for the release to confirm it.
  const press = reduce ? undefined : { scale: 0.96 };

  const inner = href ? (
    <motion.a
      href={href}
      className={cls}
      whileTap={press}
      transition={SPRING_SNAP}
    >
      {children}
    </motion.a>
  ) : (
    <motion.button
      onClick={onClick}
      className={cls}
      whileTap={press}
      transition={SPRING_SNAP}
    >
      {children}
    </motion.button>
  );

  return (
    <div
      ref={ref}
      className="inline-block"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
    >
      <motion.div style={reduce ? undefined : { x: sx, y: sy }}>
        {inner}
      </motion.div>
    </div>
  );
}
