"use client";

import type { ReactNode } from "react";
import { FadeUp, RevealWords } from "@/components/ui/Reveal";

/** Radial tick marks between two radii, centred on (32, 32). */
function ticks(count: number, r1: number, r2: number, strokeWidth: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    return (
      <line
        key={i}
        x1={(32 + r1 * cos).toFixed(2)}
        y1={(32 + r1 * sin).toFixed(2)}
        x2={(32 + r2 * cos).toFixed(2)}
        y2={(32 + r2 * sin).toFixed(2)}
        strokeWidth={strokeWidth}
      />
    );
  });
}

const SEAL_MOTION =
  "text-brass transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none motion-reduce:group-hover:rotate-0";

/** Compass-style registrar's seal: tick ring + cardinal needles. */
function AmfiSeal() {
  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={`${SEAL_MOTION} group-hover:rotate-[40deg]`}
    >
      <circle cx={32} cy={32} r={30.5} strokeWidth={1.25} />
      <circle cx={32} cy={32} r={25} strokeWidth={0.75} />
      {ticks(28, 26.5, 29.5, 0.75)}
      <circle cx={32} cy={32} r={10} strokeWidth={0.75} />
      {ticks(4, 12.5, 22.5, 1.25)}
      <circle cx={32} cy={32} r={2.5} strokeWidth={1.25} />
    </svg>
  );
}

/** Observatory-style seal: dashed ring + eight-point starburst + diamond. */
function SebiSeal() {
  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={`${SEAL_MOTION} group-hover:-rotate-[40deg]`}
    >
      <circle cx={32} cy={32} r={30.5} strokeWidth={1.25} />
      <circle cx={32} cy={32} r={26} strokeWidth={0.75} strokeDasharray="1.5 3.5" />
      {ticks(8, 10, 21.5, 1)}
      <path d="M32 25 L39 32 L32 39 L25 32 Z" strokeWidth={1} strokeLinejoin="round" />
      <circle cx={32} cy={32} r={3} strokeWidth={0.75} />
    </svg>
  );
}

function CredentialPanel({
  title,
  body,
  seal,
}: {
  title: string;
  body: string;
  seal: ReactNode;
}) {
  return (
    // Dark panel on the light ground, matching the Products preview card —
    // the seals were drawn for brass-on-dark and the inversion gives the
    // section its own figure/ground rather than repeating the page's.
    <div className="group rounded-2xl border border-lavender/10 bg-midnight p-8 transition-colors duration-ui hover:border-brass/40 md:p-12">
      {seal}
      <h3 className="mt-8 font-display track-caption text-2xl text-porcelain md:text-3xl">
        {title}
      </h3>
      <p className="mt-4 leading-relaxed text-lavender-dim">{body}</p>
    </div>
  );
}

export default function Trust() {
  return (
    // Porcelain, not midnight. Journey and Trust together were 4,370px of one
    // unbroken dark field — 43% of the page with no seam. Alternating here
    // restores the five-act tonal rhythm the rest of the page already uses.
    <section
      id="trust"
      className="bg-porcelain px-6 py-24 text-ink md:px-10 md:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Asymmetric header: heading left, the actual credential offset right */}
        <div className="grid grid-cols-12 gap-x-4 gap-y-12 sm:gap-x-8 lg:items-end">
          <div className="col-span-12 lg:col-span-7">
            <RevealWords
              text="Built on trust, run with discipline"
              as="h2"
              accent={["trust,"]}
              className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight"
            />
            <FadeUp delay={0.15} className="mt-6">
              {/* Was "Trust, transparency, and a disciplined approach to wealth
                  creation" — which repeated both nouns from the heading above
                  it and added nothing. This tells the reader what the section
                  is for instead. */}
              <p className="max-w-[48ch] text-lg leading-relaxed text-ink-muted md:text-xl">
                Every claim below is checkable. Here is what we are registered
                to do — and, just as importantly, what we are not.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.3} className="col-span-12 lg:col-span-4 lg:col-start-9">
            {/* "Licensed and certified distributor" is not a credential anyone
                issues. The registration number is, and it is public. */}
            <p className="border-t border-mist pt-6 font-display track-caption text-xl leading-snug md:text-2xl">
              AMFI-registered mutual fund distributor, ARN 341407. Platizio
              Services LLP, LLPIN AAQ-9558.
            </p>
          </FadeUp>
        </div>

        {/* Credential panels — offset vertically, never a perfect pair */}
        <div className="mt-16 grid grid-cols-12 items-start gap-x-4 gap-y-6 sm:gap-x-8 md:mt-24">
          <FadeUp delay={0.1} className="col-span-12 md:col-span-6">
            <CredentialPanel
              title="What we are registered as"
              body="A mutual fund distributor registered with the Association of Mutual Funds in India under ARN 341407. The number is public — check it against AMFI's register before you deal with us."
              seal={<AmfiSeal />}
            />
          </FadeUp>
          <div className="col-span-12 md:col-span-6 lg:mt-24">
            <FadeUp delay={0.25}>
              <CredentialPanel
                title="What we are not"
                body="We distribute SEBI-regulated products. We do not hold your funds or your securities, and we are not a broker, investment adviser, portfolio manager or research analyst."
                seal={<SebiSeal />}
              />
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
