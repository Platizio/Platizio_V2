"use client";

import { motion, useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FadeUp, RevealWords } from "@/components/ui/Reveal";

// Precomputed + rounded so server and client render identical markup.
const TICKS = Array.from({ length: 36 }, (_, i) => {
  const a = (i * 10 * Math.PI) / 180;
  const r1 = i % 9 === 0 ? 255 : 268;
  const r = (n: number) => Math.round(n * 100) / 100;
  return {
    x1: r(300 + Math.cos(a) * r1),
    y1: r(300 + Math.sin(a) * r1),
    x2: r(300 + Math.cos(a) * 280),
    y2: r(300 + Math.sin(a) * 280),
  };
});

/**
 * The drenched-violet closing act. The single closing CTA on the site: the
 * homepage renders it with every default, interior pages override the copy.
 * Defaults route to the internal consultation page.
 */
export default function ContactCTA({
  heading = "Begin with a conversation.",
  accent = ["conversation."],
  body = "Book a consultation and see which regulated products fit your goals, your horizon and your tolerance for loss.",
  buttonLabel = "Book a consultation",
  href = "/contact",
  secondary,
}: {
  heading?: string;
  accent?: string[];
  body?: string;
  buttonLabel?: string;
  href?: string;
  /** Optional secondary link, e.g. "Visit SIF Insights". */
  secondary?: { label: string; href: string };
}) {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-violet px-6 py-32 text-porcelain md:px-10 md:py-44 lg:px-16"
    >
      {/* slow-turning compass rose, barely there */}
      <motion.svg
        viewBox="0 0 600 600"
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] text-porcelain/10 md:-right-24 md:-top-24"
        // The prop stays constant so SSR and client agree; reduced motion
        // stops the loop by dropping the repeat rather than by removing it.
        animate={{ rotate: 360 }}
        transition={{
          duration: 160,
          repeat: reduce ? 0 : Infinity,
          ease: "linear",
        }}
        aria-hidden
      >
        <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="300" cy="300" r="210" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="300" cy="300" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
        {TICKS.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth="1" />
        ))}
      </motion.svg>

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-start gap-8">
        <RevealWords
          as="h2"
          text={heading}
          accent={accent}
          className="max-w-[15ch] font-display text-[clamp(2.8rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-tight"
        />
        <FadeUp delay={0.2}>
          <p className="max-w-[48ch] text-lg leading-relaxed text-porcelain/75">{body}</p>
        </FadeUp>
        <FadeUp delay={0.35}>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <MagneticButton href={href} variant="brass" className="px-9 py-4 text-base">
              {buttonLabel}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2 8h11M9 3.5 13.5 8 9 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </MagneticButton>
            {secondary && (
              <a
                href={secondary.href}
                target={secondary.href.startsWith("http") ? "_blank" : undefined}
                rel={secondary.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-2 text-base text-porcelain/85 transition-colors duration-hover hover:text-porcelain"
              >
                {secondary.label}
                <span className="transition-transform duration-hover group-hover:translate-x-1">→</span>
              </a>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
