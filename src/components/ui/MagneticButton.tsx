"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { SPRING_CONFIG } from "@/lib/motion";

/**
 * Two variants, because two are used. This map also carried "outline-dark" and
 * "violet", which a grep across src/ found no caller for — and "outline-dark"
 * was not merely dead: its `border-ink/25` measured 1.71:1 against porcelain,
 * well under the 3:1 WCAG 1.4.11 asks of a control's boundary, so adopting it
 * would have shipped an invisible button (audit finding L-10). If a dark
 * outline is ever needed, derive it from the `field` token the contact form's
 * inputs use, which was chosen for exactly this threshold.
 */
const variants = {
  brass:
    "bg-brass text-midnight hover:bg-brass/90 border border-transparent",
  /**
   * `/45`, not `/30`. This variant's border is the entire control — there is no
   * fill behind it — and at 30% opacity it composited to 2.19:1 on the midnight
   * ground, under the 3:1 WCAG 1.4.11 asks of a user interface component's
   * boundary. The same defect as the contact form's `mist` underline, in the
   * other palette.
   *
   * 45%, not the 40% that first clears the bar: 40 measures 3.02:1, and a
   * two-hundredths margin on a 1px edge is inside what antialiasing moves. 45
   * measures 3.53:1 and still reads as a quiet outline next to the brass CTA it
   * sits beside. The 70% hover state was already well clear and is unchanged.
   */
  "outline-light":
    "border border-lavender/45 text-lavender hover:border-lavender/70",
} as const;

/**
 * Whether `next/link` should own this href, or it stays a plain anchor.
 *
 * Everything beginning with a single "/" is an app route, and routing it
 * through next/link is the whole point of this predicate: "Book a
 * consultation" → /contact is the most-clicked link on the site, and as a bare
 * <a> it tore down the document and re-fetched the bundle, the fonts and the
 * CSS on every press (audit finding M-05).
 *
 * Two kinds of href deliberately stay a bare <a>:
 *
 * - In-page hashes — the hero's "#products". Lenis is constructed with
 *   `anchors: true`, which installs a delegated click listener that reads the
 *   clicked anchor's resolved href and runs its own smooth `scrollTo`; it
 *   never calls preventDefault, so it composes with the browser's default.
 *   next/link *does* preventDefault and hands the URL to the router, which
 *   would put the router's jump and Lenis's animation on the same click.
 * - Anything carrying a scheme or protocol-relative ("https:", "mailto:",
 *   "tel:", "//host"). There is no route to transition to.
 *
 * The "//" case is tested first because a protocol-relative URL also starts
 * with "/" and would otherwise be handed to the router as a path.
 */
function isAppRoute(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

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

  const inner = !href ? (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  ) : isAppRoute(href) ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
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
