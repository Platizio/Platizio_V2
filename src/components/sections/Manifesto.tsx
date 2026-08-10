"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { FadeUp } from "@/components/ui/Reveal";

// Says the thing the hero has no room for, rather than repeating the hero.
// Previously this was the hero subhead almost verbatim, so scrolling past the
// fold delivered the same sentence twice — and it led with an outcome claim a
// distributor cannot stand behind.
const STATEMENT =
  "We do not pick winners. We match regulated products to a stated goal, a stated horizon and a stated tolerance for loss — then we show you the trade-off before you commit.";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    // data-reveal so the reduced-motion rule in globals.css pins this to full
    // opacity. Handling it in CSS rather than a render branch is what keeps
    // the server and client markup identical — see below.
    <motion.span data-reveal style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

/**
 * The register shift: out of the midnight act into porcelain daylight.
 * The thesis statement inks itself in, word by word, as you scroll.
 */
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section
      id="about"
      className="bg-porcelain px-6 py-28 text-ink md:px-10 md:py-40 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-8 gap-y-14">
        <p
          ref={ref}
          className="col-span-12 max-w-[24ch] font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-medium leading-[1.18] tracking-tight lg:col-span-8"
        >
          {/* One markup shape for everyone. Branching here on
              useReducedMotion() emitted plain text on the client and <Word>
              spans on the server — that value is false during SSR — so
              hydration failed for exactly the users who asked for less motion.
              Reduced motion is handled by the [data-reveal] rule instead. */}
          {words.map((word, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
            >
              {word}
            </Word>
          ))}
        </p>

        <FadeUp
          delay={0.15}
          className="col-span-12 self-end lg:col-span-3 lg:col-start-10"
        >
          <div className="border-t border-mist pt-6">
            {/* The credential itself, not a description of one — and stated
                once here rather than three times across the page. */}
            <p className="text-base leading-relaxed text-ink-muted">
              Platizio Services LLP — AMFI-registered mutual fund distributor,
              ARN 341407.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
