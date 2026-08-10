"use client";

import { motion, useReducedMotion } from "motion/react";
import { SPRING_ENTER } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useIntroDone } from "@/components/IntroProvider";

function HeroLine({
  words,
  ready,
  baseDelay,
  className = "",
}: {
  words: string;
  ready: boolean;
  baseDelay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="block">
      {words.split(" ").map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          <motion.span
            className={`inline-block ${className}`}
            initial={{ y: "112%" }}
            animate={ready ? { y: "0%" } : {}}
            transition={
              reduce
                ? { duration: 0 }
                : { ...SPRING_ENTER, delay: baseDelay + i * 0.07 }
            }
          >
            {word}
          </motion.span>
          </span>{" "}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ready = useIntroDone();
  const reduce = useReducedMotion();

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: reduce ? { duration: 0 } : { ...SPRING_ENTER, delay },
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-midnight text-lavender"
    >
      {/* Gutter outside the 1400 container, matching every content section.
          With the padding inside the container the hero's left rail landed
          64px right of every section below it above 1528px wide. */}
      <div className="relative z-10 flex w-full flex-1 flex-col justify-end px-6 pb-14 pt-32 md:px-10 md:pb-16 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end">
        <p className="sr-only">
          Platizio — licensed distributor of Mutual Funds and Specialised
          Investment Funds.
        </p>

        <h1 className="max-w-[13ch] font-display text-[clamp(2.9rem,8vw,6rem)] font-medium leading-[1.02] tracking-tight text-porcelain">
          <HeroLine words="Navigate every" ready={ready} baseDelay={0.25} />
          <HeroLine words="market with" ready={ready} baseDelay={0.42} />
          <HeroLine
            words="confidence."
            ready={ready}
            baseDelay={0.56}
            className="italic text-brass"
          />
        </h1>

        <div className="mt-8 flex flex-col gap-10 md:mt-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            {...fadeIn(0.75)}
            className="max-w-[46ch] text-base leading-relaxed text-lavender-dim md:text-lg"
          >
            Regulated products, matched to your goals, your horizon and your
            appetite for risk — and explained before you commit.
          </motion.p>

          <motion.div {...fadeIn(0.9)} className="flex flex-wrap gap-4">
            <MagneticButton href="/contact" variant="brass">
              Book a consultation
            </MagneticButton>
            <MagneticButton href="#products" variant="outline-light">
              See the five products
            </MagneticButton>
          </motion.div>
        </div>

        {/* Two verifiable registrations, not three peer "facts". The YTD figure
            that used to lead this row was unattributed — a distributor has no
            performance of its own to report, and any return shown without a
            scheme, benchmark, period and the prescribed disclaimer is exactly
            what AMFI's code exists to prevent. */}
        <motion.div
          {...fadeIn(1.05)}
          className="mt-14 grid grid-cols-1 gap-8 border-t border-lavender/15 pt-8 sm:grid-cols-2 md:mt-16"
        >
          <div className="flex flex-col gap-1">
            <span className="font-display track-caption text-2xl text-porcelain md:text-3xl">
              AMFI
            </span>
            <span className="text-sm text-lavender-dim">
              Registered distributor · ARN 341407
            </span>
          </div>
          <div className="flex flex-col gap-1 sm:border-l sm:border-lavender/15 sm:pl-6">
            <span className="font-display track-caption text-2xl text-porcelain md:text-3xl">
              SEBI
            </span>
            <span className="text-sm text-lavender-dim">
              Regulated product frameworks
            </span>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
