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

  // data-reveal is the CSS net in globals.css — see PageHero.
  const rise = (delay: number) => ({
    "data-reveal": true,
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
          {/*
            A policy with no date is one the reader cannot tell is current —
            and this document's own text promises the field ("we will post the
            updated Policy on our website with a new effective date") while
            none of the four displayed one.

            `<time dateTime>` rather than a bare string, so the machine-readable
            value is the ISO date and the human-readable one can be spelled for
            reading. Formatted with an explicit en-IN locale and UTC time zone:
            left to the runtime's defaults this renders "7/15/2026" on a US
            server and "15/07/2026" in an Indian browser, which is a hydration
            mismatch on a prerendered page, and a date that changes shape
            depending on who is reading it is a poor thing to put on a legal
            document.
          */}
          <motion.p
            {...rise(0.4)}
            className="mt-6 font-sans text-sm text-lavender-dim"
          >
            Last updated{" "}
            <time dateTime={doc.lastUpdated} className="text-lavender">
              {new Date(`${doc.lastUpdated}T00:00:00Z`).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </motion.p>
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
              {/* Underlined at rest, not only on hover. Brass-deep against the
                  ink-muted prose around it measures 1.51:1, so until the
                  pointer arrived colour was the only thing marking this as a
                  link, and WCAG 1.4.1 asks for 3:1 or a cue that is not colour.
                  The underline is that cue; hover now carries the colour shift
                  the underline used to, so the link still answers the pointer. */}
              <p>
                Questions about this policy?{" "}
                <Link
                  href="/contact"
                  className="text-brass-deep underline underline-offset-4 transition-colors duration-hover hover:text-ink"
                >
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </FadeUp>

          {hasToc && (
            <aside>
              {/* The contents list can outgrow the screen — the longest
                  policy runs to 26 entries — and a sticky block taller than
                  the viewport pins its own bottom out of reach. Capping it
                  and letting it scroll keeps every entry reachable.
                  overscroll-contain stops that scroll chaining into the page
                  once the list bottoms out. */}
              <div className="lg:sticky lg:top-28 lg:max-h-[calc(100svh-9rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
                <p id="legal-toc-label" className="text-sm text-brass-deep">
                  Contents
                </p>
                {/* Padding rather than gap carries the spacing here. At
                    text-sm/snug each row was a 19px target, which clears WCAG
                    2.5.8 only on the spacing exception — conformant, but a
                    thumb-sized miss on a phone. Moving most of the 10px gap
                    inside the links makes each one a 31px target for 4px more
                    row pitch, and the scroll cap above absorbs that. */}
                {/* aria-labelledby: "Contents" above reads as this nav's
                    heading on screen, but nothing said so programmatically, so
                    in a landmark list it arrived as a second bare "navigation"
                    beside the site nav with no way to tell the two apart. This
                    names it without adding markup a sighted reader would see. */}
                <nav
                  aria-labelledby="legal-toc-label"
                  className="mt-4 flex flex-col gap-0.5 border-l border-mist pl-4"
                >
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="py-1.5 text-sm leading-snug text-ink-muted transition-colors duration-hover hover:text-ink"
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
