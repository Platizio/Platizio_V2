"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { LegalDoc } from "@/lib/legal";
import { buildToc } from "@/lib/content-types";
import { SiteShell } from "@/components/site/SiteShell";
import RichText from "@/components/site/RichText";
import { FadeUp } from "@/components/ui/Reveal";
import { SPRING_ENTER } from "@/lib/motion";

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const reduce = useReducedMotion();
  const toc = buildToc(doc.blocks);
  const hasToc = toc.length > 1;

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { ...SPRING_ENTER, delay },
  });

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-midnight px-6 pb-14 pt-32 text-lavender md:px-10 md:pb-16 lg:px-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-y-0 left-[19%] w-px bg-lavender/10" />
          <div className="absolute inset-y-0 left-[58%] w-px bg-lavender/10" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-[900px] flex-col">
          <motion.p {...rise(0.05)} className="text-sm text-brass">
            Legal
          </motion.p>
          <motion.h1
            {...rise(0.16)}
            className="mt-7 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-porcelain"
          >
            {doc.title}
          </motion.h1>
          {doc.subtitle && (
            <motion.p
              {...rise(0.3)}
              className="mt-7 max-w-[54ch] border-t border-lavender/15 pt-6 text-base leading-relaxed text-lavender-dim md:text-lg"
            >
              {doc.subtitle}
            </motion.p>
          )}
        </div>
      </section>

      <section className="bg-porcelain px-6 py-20 text-ink md:px-10 md:py-28 lg:px-16">
        <div
          className={`mx-auto grid max-w-[1150px] gap-12 lg:gap-16 ${
            hasToc ? "lg:grid-cols-[minmax(0,1fr)_15rem]" : ""
          }`}
        >
          <FadeUp>
            <RichText blocks={doc.blocks} />
            <div className="mt-14 border-t border-mist pt-7 text-sm text-ink-muted">
              <p>
                Questions about this policy?{" "}
                <Link href="/contact" className="text-brass-deep underline-offset-4 hover:underline">
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </FadeUp>

          {hasToc && (
            <aside>
              <div className="lg:sticky lg:top-28">
                <p className="text-sm text-brass-deep">Contents</p>
                <nav className="mt-4 flex flex-col gap-2.5 border-l border-mist pl-4">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm leading-snug text-ink-muted transition-colors duration-hover hover:text-ink"
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
    </SiteShell>
  );
}
