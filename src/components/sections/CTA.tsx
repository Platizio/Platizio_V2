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

/** The drenched-violet closing act. */
export default function CTA() {
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
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="300" cy="300" r="210" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="300" cy="300" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </motion.svg>

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-start gap-8">
        <RevealWords
          as="h2"
          text="Begin with a conversation."
          accent={["conversation."]}
          className="max-w-[14ch] font-display text-[clamp(2.8rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-tight"
        />
        <FadeUp delay={0.2}>
          <p className="max-w-[46ch] text-lg leading-relaxed text-porcelain/75">
            Book a consultation and see how a disciplined, regulated framework
            can work for your wealth.
          </p>
        </FadeUp>
        <FadeUp delay={0.35}>
          <MagneticButton
            href="/contact"
            variant="brass"
            className="px-9 py-4 text-base"
          >
            Book a Consultation
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 8h11M9 3.5 13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
        </FadeUp>
      </div>
    </section>
  );
}
