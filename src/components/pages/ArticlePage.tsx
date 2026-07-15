"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Article } from "@/lib/articles";
import { ARTICLES_SORTED } from "@/lib/articles";
import { buildToc, readingMinutes, type RichBlock } from "@/lib/content-types";
import { SiteShell } from "@/components/site/SiteShell";
import RichText from "@/components/site/RichText";
import ContactCTA from "@/components/site/ContactCTA";
import { EXPO, FadeUp } from "@/components/ui/Reveal";

const END_NOTE =
  "Mutual Fund investments are subject to market risks. Please read all scheme related documents carefully before investing. Market, tax and regulatory figures cited above are for information only and should be independently verified before you act on them.";

export default function ArticlePage({
  article,
  body,
}: {
  article: Article;
  body: RichBlock[];
}) {
  const reduce = useReducedMotion();
  const toc = buildToc(body);
  const hasToc = toc.length > 1;
  const minutes = readingMinutes(body);

  const related = ARTICLES_SORTED.filter(
    (a) => a.slug !== article.slug && a.category === article.category,
  ).slice(0, 2);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: EXPO, delay },
  });

  return (
    <SiteShell>
      {/* Hero — calmer than the marketing pages, tuned for long titles */}
      <section className="relative overflow-hidden bg-midnight px-6 pb-14 pt-32 text-lavender md:px-10 md:pb-16 lg:px-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-y-0 left-[19%] w-px bg-lavender/10" />
          <div className="absolute inset-y-0 left-[58%] w-px bg-lavender/10" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-[900px] flex-col">
          <motion.div {...rise(0.05)} className="flex items-center gap-4 text-sm">
            <Link href="/insights" className="text-brass transition-opacity hover:opacity-80">
              Media Insights
            </Link>
            <span className="text-lavender-dim">/</span>
            <span className="text-lavender-dim">{article.category}</span>
          </motion.div>

          <motion.h1
            {...rise(0.16)}
            className="mt-8 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.08] tracking-tight text-porcelain"
          >
            {article.title}
          </motion.h1>

          <motion.div
            {...rise(0.32)}
            className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-lavender/15 pt-6 text-sm text-lavender-dim"
          >
            <span>{article.date}</span>
            <span aria-hidden>·</span>
            <span>{minutes} min read</span>
            <span aria-hidden>·</span>
            <span>{article.category}</span>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-porcelain px-6 py-20 text-ink md:px-10 md:py-28 lg:px-16">
        <div
          className={`mx-auto grid max-w-[1100px] gap-12 lg:gap-16 ${
            hasToc ? "lg:grid-cols-[minmax(0,1fr)_15rem]" : ""
          }`}
        >
          <FadeUp>
            <RichText blocks={body} />
            <div className="mt-14 border-t border-mist pt-7">
              <p className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-brass-deep" aria-hidden />
                <span>{END_NOTE}</span>
              </p>
            </div>
          </FadeUp>

          {hasToc && (
            <aside>
              <div className="lg:sticky lg:top-28">
                <p className="text-sm text-brass-deep">On this page</p>
                <nav className="mt-4 flex flex-col gap-2.5 border-l border-mist pl-4">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm leading-snug text-ink-muted transition-colors duration-200 hover:text-ink"
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-midnight px-6 py-20 text-lavender md:px-10 md:py-28 lg:px-16">
          <div className="mx-auto max-w-[1100px]">
            <p className="text-sm text-brass">More in {article.category}</p>
            <div className="mt-8 grid gap-8 border-t border-lavender/15 pt-8 md:grid-cols-2">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/insights/${a.slug}`}
                  className="group flex flex-col"
                >
                  <span className="text-sm text-lavender-dim">{a.date}</span>
                  <h3 className="mt-3 font-display text-xl leading-tight tracking-tight text-porcelain transition-colors duration-300 group-hover:text-brass md:text-2xl">
                    {a.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-brass">
                    Read
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCTA />
    </SiteShell>
  );
}
