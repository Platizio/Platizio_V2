"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ARTICLES_SORTED,
  CATEGORIES,
  CATEGORY_GLYPH,
  type ArticleCategory,
} from "@/lib/articles";
import { PRODUCT_GLYPHS } from "@/lib/productGlyphs";
import { SiteShell } from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import ContactCTA from "@/components/site/ContactCTA";
import { FadeUp } from "@/components/ui/Reveal";
import { SPRING_ENTER } from "@/lib/motion";

const YT = "https://www.youtube.com/@sifinsights";

function ArticleCard({
  slug,
  title,
  category,
  date,
  excerpt,
  feature,
}: {
  slug: string;
  title: string;
  category: ArticleCategory;
  date: string;
  excerpt: string;
  feature: boolean;
}) {
  return (
    <Link
      href={`/insights/${slug}`}
      className="press press-row group flex h-full flex-col border-t border-mist pt-6 hover:border-brass-deep/50"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-brass-deep">{category}</span>
        <span className="flex size-11 items-center justify-center border border-mist text-brass-deep transition-colors duration-ui group-hover:border-brass-deep/60">
          <svg viewBox="0 0 120 120" className="w-3/5" aria-hidden>
            {PRODUCT_GLYPHS[CATEGORY_GLYPH[category]]}
          </svg>
        </span>
      </div>

      <h3 className="mt-6 font-display text-2xl leading-tight tracking-tight text-ink transition-colors duration-hover group-hover:text-brass-deep md:text-[1.7rem]">
        {title}
      </h3>

      <p className="mt-4 flex-1 leading-relaxed text-ink-muted">{excerpt}</p>

      <div className="mt-7 flex items-center justify-between text-sm text-ink-muted">
        <span>{date}</span>
        <span className="inline-flex items-center gap-2 text-brass-deep">
          {feature ? "Read article" : "Read note"}
          <span className="transition-transform duration-hover group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function InsightsIndex() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered =
    active === "All"
      ? ARTICLES_SORTED
      : ARTICLES_SORTED.filter((a) => a.category === active);

  return (
    <SiteShell>
      <PageHero
        label="Media Insights"
        headline="Read the market, not the noise."
        accent={["noise."]}
        intro="Articles, market analysis and educational content on strategy-led investing across SIF, mutual funds, AIF, PMS and international markets."
      />

      <section className="bg-porcelain px-6 py-20 text-ink md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 border-b border-mist pb-8 md:gap-3">
            {CATEGORIES.map((cat) => {
              const on = cat === active;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  aria-pressed={on}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-hover ${
                    on
                      ? "border-transparent bg-midnight text-porcelain"
                      : "border-mist text-ink-muted hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Article grid */}
          <div className="mt-12 grid gap-x-8 gap-y-12 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <motion.div
                key={a.slug}
                layout={!reduce}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce ? { duration: 0 } : { ...SPRING_ENTER, delay: (i % 3) * 0.06 }
                }
              >
                <ArticleCard {...a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SIF Insights — education ecosystem */}
      <section className="bg-midnight px-6 py-24 text-lavender md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <FadeUp>
            <p className="text-sm text-brass">SIF Insights</p>
            <h2 className="mt-5 max-w-[18ch] font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-tight tracking-tight text-porcelain">
              Educational videos on Specialised Investment Funds and market
              strategies.
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <a
              href={YT}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-brass/60 px-6 py-3.5 text-brass transition-colors duration-hover hover:bg-brass hover:text-midnight"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
              </svg>
              Visit @sifinsights on YouTube
            </a>
          </FadeUp>
        </div>
      </section>

      <ContactCTA />
    </SiteShell>
  );
}
