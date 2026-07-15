"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type ReactNode } from "react";

const variants = {
  brass:
    "bg-brass text-midnight hover:bg-brass/90 border border-transparent",
  "outline-light":
    "border border-lavender/30 text-lavender hover:border-lavender/70",
  "outline-dark": "border border-ink/25 text-ink hover:border-ink/70",
  violet: "bg-violet text-porcelain hover:bg-violet/90 border border-transparent",
} as const;

/**
 * Magnetic CTA — eases toward the cursor within its bounds, scales on press.
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
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  function onMove(e: React.PointerEvent) {
    if (reduce || !ref.current || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const cls = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-medium tracking-wide transition-colors duration-300 ${variants[variant]} ${className}`;

  const inner = href ? (
    <motion.a href={href} className={cls} whileTap={reduce ? undefined : { scale: 0.96 }}>
      {children}
    </motion.a>
  ) : (
    <motion.button onClick={onClick} className={cls} whileTap={reduce ? undefined : { scale: 0.96 }}>
      {children}
    </motion.button>
  );

  return (
    <div
      ref={ref}
      className="inline-block"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div style={reduce ? undefined : { x: sx, y: sy }}>{inner}</motion.div>
    </div>
  );
}
