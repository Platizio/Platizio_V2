"use client";

import type { ProductBlock } from "@/lib/products";
import { FadeUp, RevealWords } from "@/components/ui/Reveal";

type Tone = "light" | "dark";

const TONE = {
  light: {
    section: "bg-porcelain text-ink",
    label: "text-brass-deep",
    heading: "text-ink",
    accent: "italic text-brass-deep",
    body: "text-ink-muted",
    rule: "border-mist",
    divide: "divide-mist",
    number: "text-brass-deep",
    cardBorder: "border-mist hover:border-brass-deep/45",
    cardTitle: "text-ink",
    bullet: "bg-brass-deep",
  },
  dark: {
    section: "bg-midnight text-lavender",
    label: "text-brass",
    heading: "text-porcelain",
    accent: "italic text-brass",
    body: "text-lavender-dim",
    rule: "border-lavender/15",
    divide: "divide-lavender/12",
    number: "text-brass",
    cardBorder: "border-lavender/15 hover:border-brass/50",
    cardTitle: "text-porcelain",
    bullet: "bg-brass",
  },
} as const;

const SECTION = "px-6 py-24 md:px-10 md:py-32 lg:px-16";
const WRAP = "mx-auto max-w-[1400px]";
const HEADING =
  "font-display text-[clamp(2.2rem,4.6vw,3.75rem)] font-medium leading-[1.04] tracking-tight";

function Header({
  tone,
  label,
  heading,
  accent,
  intro,
}: {
  tone: Tone;
  label?: string;
  heading: string;
  accent?: string[];
  intro?: string;
}) {
  const t = TONE[tone];
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
      <div>
        {label && <p className={`text-sm ${t.label}`}>{label}</p>}
        <RevealWords
          as="h2"
          text={heading}
          accent={accent}
          accentClassName={t.accent}
          className={`mt-5 max-w-[16ch] ${HEADING} ${t.heading}`}
        />
      </div>
      {intro && (
        <FadeUp delay={0.15}>
          <p className={`max-w-[46ch] text-base leading-relaxed md:text-lg ${t.body}`}>
            {intro}
          </p>
        </FadeUp>
      )}
    </div>
  );
}

function Block({ block, tone }: { block: ProductBlock; tone: Tone }) {
  const t = TONE[tone];

  switch (block.kind) {
    case "prose":
      return (
        <section className={`${SECTION} ${t.section}`}>
          <div
            className={`${WRAP} grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-start lg:gap-16`}
          >
            <div>
              {block.label && <p className={`text-sm ${t.label}`}>{block.label}</p>}
              {block.heading && (
                <RevealWords
                  as="h2"
                  text={block.heading}
                  accent={block.accent}
                  accentClassName={t.accent}
                  className={`mt-5 max-w-[15ch] ${HEADING} ${t.heading}`}
                />
              )}
            </div>
            <FadeUp delay={0.15} className={`border-t ${t.rule} pt-6`}>
              {block.body.map((p, i) => (
                <p
                  key={i}
                  className={`text-base leading-relaxed md:text-lg ${t.body} ${i > 0 ? "mt-5" : ""}`}
                >
                  {p}
                </p>
              ))}
            </FadeUp>
          </div>
        </section>
      );

    case "highlights":
      return (
        <section className={`${SECTION} ${t.section}`}>
          <div className={WRAP}>
            <Header tone={tone} {...block} />
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
              {block.items.map((item, i) => (
                <FadeUp key={item.title} delay={(i % 4) * 0.07}>
                  <div className={`border-t ${t.rule} pt-5`}>
                    <span className={`inline-block size-1.5 rotate-45 ${t.bullet}`} />
                    <h3 className={`mt-4 font-display text-xl tracking-tight ${t.cardTitle}`}>
                      {item.title}
                    </h3>
                    {item.body && (
                      <p className={`mt-3 text-sm leading-relaxed ${t.body}`}>{item.body}</p>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      );

    case "reasons":
    case "steps": {
      return (
        <section className={`${SECTION} ${t.section}`}>
          <div className={WRAP}>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
              <div>
                {block.label && <p className={`text-sm ${t.label}`}>{block.label}</p>}
                <RevealWords
                  as="h2"
                  text={block.heading}
                  accent={block.accent}
                  accentClassName={t.accent}
                  className={`mt-5 max-w-[18ch] ${HEADING} ${t.heading}`}
                />
                {block.intro && (
                  <FadeUp delay={0.15}>
                    <p className={`mt-6 max-w-[42ch] leading-relaxed ${t.body}`}>{block.intro}</p>
                  </FadeUp>
                )}
              </div>
              <div className={`divide-y ${t.divide} border-y ${t.rule}`}>
                {block.items.map((item, i) => (
                  <FadeUp
                    key={item.title}
                    delay={i * 0.09}
                    className="grid gap-4 py-8 md:grid-cols-[4rem_1fr] md:py-10"
                  >
                    <span className={`font-display text-2xl ${t.number}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className={`font-display text-xl tracking-tight md:text-2xl ${t.cardTitle}`}>
                        {item.title}
                      </h3>
                      <p className={`mt-3 max-w-[54ch] leading-relaxed ${t.body}`}>{item.body}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "cards":
      return (
        <section className={`${SECTION} ${t.section}`}>
          <div className={WRAP}>
            <Header tone={tone} {...block} />
            <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
              {block.items.map((item, i) => (
                <FadeUp key={item.title} delay={(i % 3) * 0.08}>
                  <article
                    className={`h-full border ${t.cardBorder} p-7 transition-colors duration-ui md:p-8`}
                  >
                    {item.label && (
                      <span className={`text-sm tabular-nums ${t.label}`}>{item.label}</span>
                    )}
                    <h3
                      className={`mt-4 font-display text-2xl tracking-tight ${t.cardTitle} md:text-[1.7rem]`}
                    >
                      {item.title}
                    </h3>
                    <p className={`mt-4 leading-relaxed ${t.body}`}>{item.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      );

    case "table":
      return (
        <section className={`${SECTION} ${t.section}`}>
          <div className={WRAP}>
            <Header tone={tone} {...block} />

            {/* md+ : real table */}
            <div className="mt-12 hidden overflow-x-auto md:mt-16 md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className={`border-b ${t.rule}`}>
                    {block.columns.map((c) => (
                      <th
                        key={c}
                        className={`px-4 pb-4 text-sm font-medium ${t.label} first:pl-0`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={ri} className={`border-b ${t.rule} align-top`}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`px-4 py-6 first:pl-0 ${
                            ci === 0
                              ? `w-[22%] font-display text-lg tracking-tight ${t.cardTitle}`
                              : `text-sm leading-relaxed ${t.body}`
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* mobile : stacked cards */}
            <div className={`mt-10 divide-y ${t.divide} border-y ${t.rule} md:hidden`}>
              {block.rows.map((row, ri) => (
                <div key={ri} className="py-6">
                  <h3 className={`font-display text-xl tracking-tight ${t.cardTitle}`}>{row[0]}</h3>
                  {row.slice(1).map((cell, ci) => (
                    <div key={ci} className="mt-3">
                      <span className={`text-xs uppercase tracking-wide ${t.label}`}>
                        {block.columns[ci + 1]}
                      </span>
                      <p className={`mt-1 text-sm leading-relaxed ${t.body}`}>{cell}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "callout":
      return (
        <section className={`${SECTION} ${t.section}`}>
          <div className={WRAP}>
            <FadeUp>
              <div
                className={`grid gap-8 border ${TONE[tone].rule} p-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:p-12 lg:p-16`}
              >
                <div>
                  {block.label && <p className={`text-sm ${t.label}`}>{block.label}</p>}
                  <p className={`mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] leading-none tracking-tight ${t.heading}`}>
                    {block.title}
                  </p>
                </div>
                <div className={`border-t ${t.rule} pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0`}>
                  {block.body.map((p, i) => (
                    <p key={i} className={`leading-relaxed ${t.body} ${i > 0 ? "mt-4" : ""}`}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      );

    case "note":
      return (
        <section className={`px-6 py-14 md:px-10 lg:px-16 ${t.section}`}>
          <div className={`${WRAP} flex items-start gap-4 border-t ${t.rule} pt-8`}>
            <span className={`mt-2 size-1.5 shrink-0 rotate-45 ${t.bullet}`} aria-hidden />
            <p className={`max-w-[70ch] text-sm leading-relaxed ${t.body}`}>{block.body}</p>
          </div>
        </section>
      );
  }
}

/** Renders product content blocks, alternating porcelain/midnight tones. */
export default function ProductBlocks({ blocks }: { blocks: ProductBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} tone={i % 2 === 0 ? "light" : "dark"} />
      ))}
    </>
  );
}
