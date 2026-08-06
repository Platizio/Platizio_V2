"use client";

const ITEMS = [
  "International Investing",
  "Specialised Investment Funds",
  "Mutual Funds",
  "Portfolio Management Services",
  "Alternative Investment Funds",
  "AMFI Registered",
  "SEBI Compliant",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-7 font-display track-caption text-lg italic text-lavender-dim md:px-10 md:text-xl">
            {item}
          </span>
          <span className="block size-1.5 rotate-45 bg-brass" aria-hidden />
        </span>
      ))}
    </div>
  );
}

/** Continuous index-board marquee between the hero and the light act. */
export default function Ticker() {
  return (
    <div className="relative border-y border-lavender/10 bg-midnight py-5 md:py-6">
      <p className="sr-only">
        {ITEMS.join(", ")}
      </p>
      <div className="flex overflow-hidden" aria-hidden>
        <div className="flex animate-marquee will-change-transform">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
