"use client";

import {
  motion,
  useReducedMotion,
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
    <motion.span style={{ opacity }} className="inline">
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
  const reduce = useReducedMotion();
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
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1fr_minmax(0,240px)]">
        <p
          ref={ref}
          className="max-w-[24ch] font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-medium leading-[1.18] tracking-tight"
        >
          {reduce
            ? STATEMENT
            : words.map((word, i) => (
                <Word
                  key={i}
                  progress={scrollYProgress}
                  range={[i / words.length, (i + 1) / words.length]}
                >
                  {word}
                </Word>
              ))}
        </p>

        <FadeUp delay={0.15} className="self-end">
          <div className="border-t border-mist pt-6">
            <p className="text-[0.95rem] leading-relaxed text-ink-muted">
              Platizio Services LLP is a licensed and certified distributor of
              Mutual Funds and Specialised Investment Funds (SIFs).
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
