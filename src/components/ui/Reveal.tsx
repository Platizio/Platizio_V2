"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_ENTER } from "@/lib/motion";

// Pre-created so every tag's motion component has a stable identity.
const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
  blockquote: motion.blockquote,
} as const;

export type RevealTag = keyof typeof MOTION_TAGS;

/**
 * Word-by-word masked rise. Each word slides up out of an overflow-hidden
 * clip, landonorris-style. Pass `accent` to render given words in italic
 * display style.
 */
export function RevealWords({
  text,
  as = "span",
  className = "",
  wordClassName = "",
  accent = [],
  accentClassName = "italic",
  delay = 0,
  stagger = 0.055,
  /** Spring response — seconds for a word to visually arrive, not a duration. */
  response = 0.72,
  once = true,
}: {
  text: string;
  as?: RevealTag;
  className?: string;
  wordClassName?: string;
  accent?: string[];
  accentClassName?: string;
  delay?: number;
  stagger?: number;
  response?: number;
  once?: boolean;
}) {
  const MTag = MOTION_TAGS[as];
  const reduce = useReducedMotion();
  const words = text.split(" ");

  // One DOM shape for everyone. Returning different markup when `reduce` is
  // true desynchronises server and client — useReducedMotion() is false during
  // SSR — and hydration fails for precisely the users who asked for less
  // motion. `initial` must stay identical too, since Motion writes it into the
  // SSR output; only `transition` may vary, because transitions are not
  // rendered. The reduced path snaps (duration 0) rather than animating, and
  // the CSS net in globals.css guarantees the final state even if the
  // observer never fires at all.
  const wordVariants: Variants = {
    hidden: { y: "115%" },
    show: {
      y: "0%",
      transition: reduce
        ? { duration: 0 }
        : { ...SPRING_ENTER, visualDuration: response },
    },
  };

  return (
    <MTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-8% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              data-reveal
              variants={wordVariants}
              className={`inline-block will-change-transform ${wordClassName} ${
                accent.includes(word) ? accentClassName : ""
              }`}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </MTag>
  );
}

const fadeUp = (reduce: boolean | null): Variants => ({
  hidden: { opacity: 0, y: 28 },
  show: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    // Reduced motion snaps instead of springing. Only the transition may
    // differ between server and client — see RevealWords above.
    transition: reduce ? { duration: 0 } : { ...SPRING_ENTER, delay: custom },
  }),
});

/** Content already visible by default for non-JS; fades and rises in view. */
export function FadeUp({
  children,
  className = "",
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      variants={fadeUp(reduce)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px" }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
