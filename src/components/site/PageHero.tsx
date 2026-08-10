"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SPRING_ENTER } from "@/lib/motion";

const STARS = [
  [7, 23, 2],
  [15, 13, 3],
  [22, 35, 1.5],
  [33, 19, 2],
  [41, 40, 1.5],
  [53, 9, 2.5],
  [65, 29, 1.5],
  [73, 16, 2],
  [84, 35, 2.5],
  [92, 12, 1.5],
] as const;

/**
 * Interior-page hero — the midnight-observatory opening act reused across
 * products, insights, contact and legal pages. Charted grid lines, a slow
 * twinkle of brass stars, and one italic accent phrase. Animates once on
 * mount (interior pages have no preloader to gate on).
 */
export default function PageHero({
  label,
  headline,
  accent = [],
  intro,
  chips,
  meta,
  mark,
  compact = false,
}: {
  label: string;
  headline: string;
  accent?: string[];
  intro?: string;
  chips?: string[];
  /** Small key/value pairs shown under the intro, e.g. article date/category. */
  meta?: { label: string; value: string }[];
  /** Optional signature glyph, framed at the top-right of the content column. */
  mark?: ReactNode;
  /** Tighter vertical rhythm for text-forward pages (legal, articles). */
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = headline.split(" ");

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { ...SPRING_ENTER, delay },
  });

  return (
    <section
      className={`relative flex overflow-hidden bg-midnight px-6 text-lavender md:px-10 lg:px-16 ${
        compact
          ? "min-h-[62svh] pb-14 pt-32 md:pb-16"
          : "min-h-[92svh] pb-16 pt-32 md:pb-20"
      }`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-y-0 left-[19%] w-px bg-lavender/10" />
        <div className="absolute inset-y-0 left-[58%] w-px bg-lavender/10" />
        <div className="absolute inset-x-0 top-[61%] h-px bg-lavender/10" />
        {STARS.map(([x, y, size], i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-brass"
            style={{ left: `${x}%`, top: `${y}%`, width: size * 2, height: size * 2 }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.45, 1] }}
            transition={{
              duration: 3.5 + i * 0.35,
              repeat: reduce ? 0 : Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
        <svg
          viewBox="0 0 1000 560"
          className="absolute -bottom-16 right-[-12rem] h-[34rem] w-[62rem] text-violet-bright/25"
          fill="none"
        >
          <path
            d="M0 460C157 338 241 471 372 332S629 367 717 206 891 148 1000 60"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M0 498C186 377 260 509 404 372S650 412 753 258 901 192 1000 122"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 7"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-end">
        {mark && (
          <motion.div
            {...rise(0.04)}
            className="mb-10 flex size-20 items-center justify-center self-start border border-brass/40 text-brass md:size-24"
            aria-hidden
          >
            <svg viewBox="0 0 120 120" className="w-3/5">
              {mark}
            </svg>
          </motion.div>
        )}
        <motion.p {...rise(0.06)} className="text-sm text-brass">
          {label}
        </motion.p>

        <h1
          className={`mt-8 max-w-[13ch] font-display font-medium leading-[0.99] tracking-tight text-porcelain ${
            compact
              ? "text-[clamp(2.6rem,6vw,5rem)]"
              : "text-[clamp(3rem,7.5vw,6.25rem)]"
          }`}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              {...rise(0.2 + i * 0.08)}
              className={`mr-[0.28em] inline-block ${
                accent.includes(word) ? "italic text-brass" : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {(intro || chips || meta) && (
          <div className="mt-11 grid gap-9 border-t border-lavender/15 pt-7 md:mt-14 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            {intro ? (
              <motion.p
                {...rise(0.5)}
                className="max-w-[54ch] text-base leading-relaxed text-lavender-dim md:text-lg"
              >
                {intro}
              </motion.p>
            ) : (
              <span />
            )}

            {chips && (
              <motion.div
                {...rise(0.6)}
                className="flex flex-wrap gap-x-7 gap-y-3 text-sm"
              >
                {chips.map((chip) => (
                  <span key={chip} className="flex items-center gap-2 text-lavender">
                    <span className="size-1.5 rotate-45 bg-brass" /> {chip}
                  </span>
                ))}
              </motion.div>
            )}

            {meta && (
              <motion.dl {...rise(0.6)} className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
                {meta.map((m) => (
                  <div key={m.label} className="flex flex-col gap-1">
                    <dt className="text-brass">{m.label}</dt>
                    <dd className="text-lavender">{m.value}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
