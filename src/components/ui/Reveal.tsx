"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

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
  duration = 1.1,
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
  duration?: number;
  once?: boolean;
}) {
  const Tag = as as ElementType<{
    className?: string;
    children?: ReactNode;
    "aria-label"?: string;
  }>;
  const MTag = MOTION_TAGS[as];
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return (
      <Tag className={className}>
        {words.map((w, i) => (
          <span
            key={i}
            className={accent.includes(w) ? accentClassName : undefined}
          >
            {w}{" "}
          </span>
        ))}
      </Tag>
    );
  }

  // The observer must watch the (visible) parent: a word clipped by its own
  // overflow-hidden mask never intersects the viewport, so per-word
  // whileInView would never fire. Variants propagate the trigger down.
  const wordVariants: Variants = {
    hidden: { y: "115%" },
    show: { y: "0%", transition: { duration, ease: EXPO } },
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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: custom, ease: EXPO },
  }),
};

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
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px" }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

export { EXPO };
