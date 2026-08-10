"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { SPRING_CONFIG } from "@/lib/motion";

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

  /**
   * The press uses the shared `.press` utility rather than Motion's whileTap.
   * Two reasons. It is now the single press mechanism on the site, so the
   * feedback is identical here and on rows, nav links and footer links —
   * including the reduced-motion path, where `.press` swaps the transform for
   * an opacity dip. And whileTap made Motion emit `tabindex="0"`; because the
   * prop was gated on useReducedMotion() — false during SSR — the server wrote
   * that attribute and a reduced-motion client did not, failing hydration.
   * `.press` also owns the colour transition, so no `transition-colors` here.
   */
  const cls = `press inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-medium tracking-wide ${variants[variant]} ${className}`;

  const inner = href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );

  return (
    <div
      ref={ref}
      className="inline-block"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
    >
      <motion.div style={{ x: sx, y: sy }}>
        {inner}
      </motion.div>
    </div>
  );
}
