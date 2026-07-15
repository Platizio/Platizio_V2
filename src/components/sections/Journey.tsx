"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { EXPO, FadeUp, RevealWords } from "@/components/ui/Reveal";

type Step = {
  num: string;
  title: string;
  /** First clause — rendered in full lavender. */
  lead: string;
  /** Remainder of the sentence — rendered dimmed. */
  rest: string;
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Profiling",
    lead: "Every engagement begins with understanding you",
    rest: " — your goals, your horizon, and your appetite for risk.",
  },
  {
    num: "02",
    title: "Asset Allocation",
    lead: "A disciplined allocation across regulated instruments, explained clearly:",
    rest: " why it fits your goals, what risks exist, and how it behaves in different market conditions.",
  },
  {
    num: "03",
    title: "Periodic Reviews",
    lead: "Structured reviews keep your portfolio aligned as markets and life change",
    rest: " — so the plan holds without daily tracking.",
  },
];

function StepBody({ step }: { step: Step }) {
  return (
    <p className="mt-5 max-w-[55ch] text-base md:text-lg leading-relaxed text-lavender-dim">
      <span className="text-lavender">{step.lead}</span>
      {step.rest}
    </p>
  );
}

export default function Journey() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(
      Math.max(0, Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))),
    );
  });

  return (
    <section
      id="journey"
      className="bg-midnight text-lavender px-6 md:px-10 lg:px-16 py-24 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Heading */}
        <div className="max-w-[760px]">
          <RevealWords
            text="Your investment journey"
            as="h2"
            accent={["journey"]}
            className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight"
          />
          <FadeUp delay={0.15} className="mt-6">
            <p className="text-lavender-dim text-lg md:text-xl leading-relaxed max-w-[52ch]">
              A structured process — so you stay invested with confidence,
              without constant monitoring.
            </p>
          </FadeUp>
        </div>

        {/* Mobile / reduced-motion: static stacked list */}
        <div
          className={
            reduce
              ? "mt-16 divide-y divide-lavender/15"
              : "mt-16 divide-y divide-lavender/15 lg:hidden"
          }
        >
          {STEPS.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.12} className="py-10">
              <span className="block font-display text-3xl leading-none text-brass">
                {step.num}
              </span>
              <h3 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-tight">
                {step.title}
              </h3>
              <StepBody step={step} />
            </FadeUp>
          ))}
        </div>

        {/* Desktop: sticky scrollytelling (~300vh track) */}
        {!reduce && (
          <div
            ref={trackRef}
            className="hidden lg:grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-20 mt-8"
          >
            {/* Sticky left: big rolling number + progress line */}
            <div>
              <div className="sticky top-0 h-screen flex items-center">
                <div className="flex items-center gap-12" aria-hidden="true">
                  {/* Progress line */}
                  <div className="relative h-[46vh] w-px bg-lavender/15">
                    <motion.div
                      className="absolute inset-0 bg-brass origin-top"
                      style={{ scaleY: scrollYProgress }}
                    />
                  </div>
                  {/* Counter-rolling step number */}
                  <div>
                    <div className="relative h-[1em] min-w-[1.35em] font-display leading-none tracking-tight text-[clamp(6rem,14vw,11rem)]">
                      {STEPS.map((step, i) => (
                        <motion.span
                          key={step.num}
                          className="absolute inset-0 block will-change-transform"
                          initial={false}
                          animate={{
                            opacity: active === i ? 1 : 0,
                            y:
                              active === i
                                ? "0%"
                                : i < active
                                  ? "-24%"
                                  : "24%",
                          }}
                          transition={{ duration: 0.8, ease: EXPO }}
                        >
                          {step.num}
                        </motion.span>
                      ))}
                    </div>
                    <p className="mt-6 text-lavender-dim">/ 03</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrolling right: one viewport-height block per step */}
            <div>
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="min-h-screen flex items-center"
                >
                  <div>
                    <h3
                      className={`font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-tight transition-colors duration-500 ${
                        active === i ? "text-brass" : "text-lavender"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <StepBody step={step} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
