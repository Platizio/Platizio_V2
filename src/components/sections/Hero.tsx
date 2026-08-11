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
          {/* data-reveal is the CSS net in globals.css. This word starts
              translated fully below its own mask, so without the net it is
              clipped out of view rather than merely transparent — the one
              parked state that opacity alone would not rescue. */}
          <motion.span
            data-reveal
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
      className="relative flex min-h-[100svh] flex-col bg-midnight text-lavender"
    >
      {/* Gutter outside the 1400 container, matching every content section.
          With the padding inside the container the hero's left rail landed
          64px right of every section below it above 1528px wide. */}
      <div className="relative z-10 flex w-full flex-1 flex-col px-6 pb-14 pt-32 md:px-10 md:pb-16 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
          <p className="sr-only">
            Platizio — licensed distributor of Mutual Funds and Specialised
            Investment Funds.
          </p>

          {/* Centred in whatever height the rail leaves. Anchoring the block
              to the bottom edge only ever made sense when something else
              occupied the upper third of the section; with the ground flat
              from the nav down, that third was simply empty. */}
          <div className="flex flex-1 flex-col justify-center">
            {/* Three compositions on one grid, all placed explicitly rather
                than left to auto-placement:
                  base  — one column, source order.
                  md    — headline across the top, then subhead left and CTAs
                          right sharing row 2, bottom-aligned.
                  lg    — headline left of row 1, subhead right of it, CTAs
                          below the headline in row 2.
                Auto-placement cannot express the md row (a 6-wide cell would
                not fit beside a 12-wide headline) and only appears to get lg
                right by accident, so every cell states its own start. */}
            <div className="grid grid-cols-12 gap-x-4 gap-y-10 sm:gap-x-8 md:items-end">
              {/* Seven columns at lg, not the six the spec drew: six is
                  narrower than "Navigate every" everywhere below ~1215px, and
                  the headline broke to four lines across that whole band. Six
                  columns grow at half the viewport rate while the type climbs
                  at 8vw, so they only pull clear slowly — 3px of daylight at
                  1280, 62px once the container caps at 1400. The spec's
                  six-column composition therefore returns at 2xl rather than
                  xl. Nothing moves at that seam: the line is shorter than
                  either box, so the span decides only where it would break. */}
              <h1 className="col-span-12 max-w-[13ch] font-display text-[clamp(2.9rem,8vw,7.25rem)] font-medium leading-[1.02] tracking-tight text-porcelain md:row-start-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 2xl:col-span-6">
                <HeroLine words="Navigate every" ready={ready} baseDelay={0.25} />
                <HeroLine words="market with" ready={ready} baseDelay={0.42} />
                <HeroLine
                  words="confidence."
                  ready={ready}
                  baseDelay={0.56}
                  className="italic text-brass"
                />
              </h1>

              {/* items-end bottom-aligns this to whatever shares its row: the
                  CTAs at md, the headline at lg — which is what makes the eye
                  run diagonally from "Navigate" down to here. Below md the
                  max-w does the work instead, since one column at 640px is
                  already wider than this reads well at. */}
              <motion.p
                {...fadeIn(0.75)}
                data-reveal
                className="col-span-12 max-w-[46ch] text-base leading-relaxed text-lavender-dim md:col-span-6 md:col-start-1 md:row-start-2 md:text-lg lg:col-span-4 lg:col-start-9 lg:row-start-1"
              >
                Regulated products, matched to your goals, your horizon and
                your appetite for risk — and explained before you commit.
              </motion.p>

              {/* Shares row 2 with the subhead from md up, pinned to the right
                  edge of the container — the pairing this section had before
                  the grid rewrite, which the rewrite dropped by giving both
                  cells twelve columns until lg. Back on the left below the
                  headline at lg, where the subhead moves up into row 1. */}
              <motion.div
                {...fadeIn(0.9)}
                data-reveal
                className="col-span-12 flex flex-wrap gap-4 md:col-span-6 md:col-start-7 md:row-start-2 md:justify-end lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:justify-start 2xl:col-span-6"
              >
                <MagneticButton href="/contact" variant="brass">
                  Book a consultation
                </MagneticButton>
                <MagneticButton href="#products" variant="outline-light">
                  See the five products
                </MagneticButton>
              </motion.div>
            </div>
          </div>

          {/* Two verifiable registrations, not three peer "facts". The YTD
              figure that used to lead this row was unattributed — a
              distributor has no performance of its own to report, and any
              return shown without a scheme, benchmark, period and the
              prescribed disclaimer is exactly what AMFI's code exists to
              prevent.

              Its own grid rather than a third row of the one above, because
              it is pinned to the bottom edge while that block is centred.
              Same 12-column track, so the cells still line up across the
              seam. The divider that used to sit between the two cells is
              gone: the border-t already separates the rail, and at four empty
              columns a second rule is noise. */}
          <motion.div
            {...fadeIn(1.05)}
            data-reveal
            className="mt-14 grid grid-cols-12 gap-x-4 gap-y-8 border-t border-lavender/15 pt-8 sm:gap-x-8 md:mt-16"
          >
            <div className="col-span-12 flex flex-col gap-1 sm:col-span-6 lg:col-span-4 lg:col-start-1">
              <span className="font-display track-caption text-2xl text-porcelain md:text-3xl">
                AMFI
              </span>
              <span className="text-sm text-lavender-dim">
                Registered distributor · ARN 341407
              </span>
            </div>
            <div className="col-span-12 flex flex-col gap-1 sm:col-span-6 lg:col-span-4 lg:col-start-9">
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
