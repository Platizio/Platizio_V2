"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PRODUCTS } from "@/lib/products";
import { SiteShell } from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import ContactCTA from "@/components/site/ContactCTA";
import { EXPO, FadeUp } from "@/components/ui/Reveal";

function ProductRow({
  index,
  href,
  tag,
  name,
  description,
  active,
  onActivate,
  onDeactivate,
}: {
  index: number;
  href: string;
  tag: string;
  name: string;
  description: string;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden border-t border-mist"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-midnight will-change-transform"
        initial={false}
        animate={
          reduce
            ? { opacity: active ? 1 : 0, scaleY: 1 }
            : { opacity: 1, scaleY: active ? 1 : 0 }
        }
        style={{ originY: active ? 1 : 0 }}
        transition={{ duration: reduce ? 0.2 : 0.4, ease: EXPO }}
      />

      <div className="relative z-10 flex flex-col gap-3 px-1 py-8 md:py-10 lg:grid lg:grid-cols-[7rem_1fr_minmax(0,20rem)_3.5rem] lg:items-center lg:gap-8">
        <span
          className={`text-sm tabular-nums transition-colors duration-300 ${
            active ? "text-brass" : "text-brass-deep"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
          <span className="mx-2 opacity-40">/</span>
          {tag}
        </span>

        <span
          className={`font-display text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.05] tracking-tight transition-colors duration-300 ${
            active ? "text-violet-bright" : "text-ink"
          }`}
        >
          {name}
        </span>

        <span
          className={`max-w-md text-sm leading-relaxed transition-colors duration-300 md:text-base ${
            active ? "text-lavender-dim" : "text-ink-muted"
          }`}
        >
          {description}
        </span>

        <span
          aria-hidden
          className={`hidden justify-self-end transition-all duration-300 ease-out lg:block ${
            active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          }`}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-brass">
            <path
              d="M5 14 H 22 M15 6.5 L 22.5 14 L 15 21.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function ProductsIndex() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const activate = (i: number) => {
    setActiveIndex(i);
    setPreviewIndex(i);
  };

  const preview = PRODUCTS[previewIndex];

  return (
    <SiteShell>
      <PageHero
        label="Products"
        headline="Five instruments. One discipline."
        accent={["discipline."]}
        intro="A regulated line-up matched to your goals, horizon and appetite for risk — from disciplined mutual funds to advanced, strategy-led funds."
        chips={["AMFI Registered", "SEBI Compliant"]}
      />

      <section className="bg-porcelain px-6 py-24 text-ink md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-16 xl:grid-cols-[1fr_22rem]">
            <div className="border-b border-mist">
              {PRODUCTS.map((product, i) => (
                <FadeUp key={product.slug} delay={0.06 + i * 0.06}>
                  <ProductRow
                    index={i}
                    href={`/products/${product.slug}`}
                    tag={product.tag}
                    name={product.name}
                    description={product.hero.intro}
                    active={activeIndex === i}
                    onActivate={() => activate(i)}
                    onDeactivate={() => setActiveIndex(null)}
                  />
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.3} className="hidden lg:sticky lg:top-24 lg:block">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-midnight">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={preview.tag}
                    className="absolute inset-0 flex flex-col justify-between p-8"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                    transition={{ duration: 0.3, ease: EXPO }}
                  >
                    <span className="text-sm tabular-nums text-brass">
                      {String(previewIndex + 1).padStart(2, "0")}
                      <span className="mx-2 opacity-40">/</span>
                      05
                    </span>
                    <svg viewBox="0 0 120 120" className="mx-auto w-3/5 text-violet-bright" aria-hidden>
                      {preview.glyph}
                    </svg>
                    <span className="font-display text-lg text-lavender">{preview.name}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <ContactCTA />
    </SiteShell>
  );
}
