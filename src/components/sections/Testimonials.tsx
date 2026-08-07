"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { RevealWords, FadeUp } from "@/components/ui/Reveal";

const QUOTES = [
  {
    text: "What I appreciate most about Platizio is transparency. Every recommendation is explained clearly — why it fits my goals, what risks exist, and how it behaves in different market conditions. This level of clarity is rare in financial advisory.",
    name: "Amit Kumar",
    role: "Investor",
  },
  {
    text: "As a working professional, I don't have time to track markets daily. Platizio's structured process — profiling, asset allocation, and periodic reviews — allows me to stay invested with confidence without constant monitoring.",
    name: "Ashish Kumar",
    role: "Working Professional",
  },
];

/* Oversized asterisk-like mark — hand-set, six-armed, brass on porcelain. */
function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`h-10 w-10 text-brass-deep md:h-12 md:w-12 ${className}`}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M24 6 V 42" />
      <path d="M8.4 15 L 39.6 33" />
      <path d="M39.6 15 L 8.4 33" />
    </svg>
  );
}

function Attribution({ name, role }: { name: string; role: string }) {
  return (
    <footer className="mt-8 flex items-baseline gap-3 text-sm md:mt-10">
      <span className="font-medium text-ink">{name}</span>
      <span aria-hidden className="h-px w-8 self-center bg-mist" />
      <span className="text-ink-muted">{role}</span>
    </footer>
  );
}

export default function Testimonials() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  /* Subtle counter-drift between the two quotes — a few dozen px. */
  const yFirst = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const ySecond = useTransform(scrollYProgress, [0, 1], [-32, 32]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-mist bg-porcelain px-6 py-24 text-ink md:px-10 md:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Heading — small, held to the left rail */}
          <div className="lg:col-span-3">
            <RevealWords
              text="In their words"
              as="h2"
              accent={["words"]}
              className="block font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.05] tracking-tight"
            />
          </div>

          {/* First quote — pushed right */}
          <motion.div
            className="mt-16 lg:col-span-8 lg:col-start-5 lg:mt-4"
            style={reduce ? undefined : { y: yFirst }}
          >
            <blockquote>
              <FadeUp>
                <QuoteMark />
              </FadeUp>
              <RevealWords
                text={`“${QUOTES[0].text}”`}
                as="p"
                className="mt-6 block font-display text-[clamp(1.4rem,2.4vw,2.1rem)] leading-snug"
                stagger={0.014}
                response={0.55}
              />
              <FadeUp delay={0.2}>
                <Attribution name={QUOTES[0].name} role={QUOTES[0].role} />
              </FadeUp>
            </blockquote>
          </motion.div>

          {/* Second quote — pulled back left, set lower */}
          <motion.div
            className="mt-20 md:mt-28 lg:col-span-7 lg:col-start-2 lg:mt-36"
            style={reduce ? undefined : { y: ySecond }}
          >
            <FadeUp delay={0.15}>
              <blockquote>
                <QuoteMark />
                <p className="mt-6 font-display text-[clamp(1.4rem,2.4vw,2.1rem)] leading-snug">
                  {"“"}
                  {QUOTES[1].text}
                  {"”"}
                </p>
                <Attribution name={QUOTES[1].name} role={QUOTES[1].role} />
              </blockquote>
            </FadeUp>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
