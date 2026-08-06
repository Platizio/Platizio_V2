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
    <div className="group bg-midnight-2 border border-lavender/10 hover:border-brass/40 rounded-2xl p-8 md:p-12 transition-colors duration-500">
      {seal}
      <h3 className="mt-8 font-display track-caption text-2xl md:text-3xl">
        {title}
      </h3>
      <p className="mt-4 text-lavender-dim leading-relaxed">{body}</p>
    </div>
  );
}

export default function Trust() {
  return (
    <section
      id="trust"
      className="bg-midnight text-lavender px-6 md:px-10 lg:px-16 py-24 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Asymmetric header: heading left, licence statement offset right */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 lg:items-end">
          <div className="lg:col-span-7">
            <RevealWords
              text="Built on trust, run with discipline"
              as="h2"
              accent={["trust,"]}
              className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight"
            />
            <FadeUp delay={0.15} className="mt-6">
              <p className="text-lavender-dim text-lg md:text-xl leading-relaxed max-w-[48ch]">
                Trust, transparency, and a disciplined approach to wealth
                creation.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.3} className="lg:col-span-4 lg:col-start-9">
            <p className="border-t border-lavender/15 pt-6 font-display track-caption text-xl md:text-2xl leading-snug">
              Platizio Services LLP is a licensed and certified distributor of
              Mutual Funds and Specialised Investment Funds.
            </p>
          </FadeUp>
        </div>

        {/* Credential panels — offset vertically, never a perfect pair */}
        <div className="mt-16 md:mt-24 grid gap-6 md:grid-cols-2 lg:gap-10 items-start">
          <FadeUp delay={0.1}>
            <CredentialPanel
              title="AMFI Registration"
              body="Platizio Services LLP is registered with the Association of Mutual Funds in India (AMFI), ensuring adherence to the highest standards of ethical mutual fund distribution."
              seal={<AmfiSeal />}
            />
          </FadeUp>
          <div className="lg:mt-24">
            <FadeUp delay={0.25}>
              <CredentialPanel
                title="SEBI Compliance"
                body="We operate under the regulatory framework of the Securities and Exchange Board of India (SEBI), maintaining full transparency and investor protection across all offerings."
                seal={<SebiSeal />}
              />
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
