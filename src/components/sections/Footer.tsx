import Link from "next/link";
import { RISK_DISCLAIMER } from "@/lib/products";

// Named by channel rather than by handle alone, so the reader knows which
// part of the line-up each one covers before clicking away.
const YOUTUBE_CHANNELS = [
  {
    name: "SIF Insights",
    handle: "@sifinsights",
    href: "https://www.youtube.com/@sifinsights",
  },
  {
    name: "Platizio Alternatives",
    handle: "@PlatizioAlternatives",
    href: "https://www.youtube.com/@PlatizioAlternatives",
  },
  {
    name: "Platizio Global",
    handle: "@PlatizioGlobal",
    href: "https://www.youtube.com/@PlatizioGlobal",
  },
];

// Labels match the nav for the three shared destinations — a link should not
// change its name between the header and the footer.
const QUICK_LINKS = [
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
  { label: "Terms & Conditions", href: "/terms-and-condition" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  {
    label: "Privacy Policy – Global Investing",
    href: "/global-investing/privacy-policy",
  },
  {
    label: "Terms & Conditions – Global Investing",
    href: "/global-investing/terms-and-condition",
  },
];

const PRODUCT_LINKS = [
  { label: "International Investing", href: "/products/international" },
  { label: "Specialised Investment Funds", href: "/products/sif" },
  { label: "Mutual Funds", href: "/products/mutual-funds" },
  { label: "Portfolio Management Services", href: "/products/pms" },
  { label: "Alternative Investment Funds", href: "/products/aif" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-midnight text-lavender">
      <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-20 md:px-10 md:pt-28 lg:px-16">
        <div className="grid grid-cols-12 gap-x-4 gap-y-14 border-b border-lavender/10 pb-16 sm:gap-x-8">
          <div className="col-span-12 flex flex-col gap-5 md:col-span-6">
            <span className="font-display track-caption text-3xl text-porcelain">
              Platizio
            </span>
            <p className="max-w-[36ch] text-base leading-relaxed text-lavender-dim">
              Navigate every market with confidence — regulated, transparent,
              explained.
            </p>
            {/* Three channels, so each one is named. A bare "YouTube" link
                told the reader nothing about whose channel it was or what was
                on it; with three that ambiguity compounds. One icon marks the
                group rather than repeating identically on every row. */}
            <div className="mt-2 flex flex-col gap-3">
              <span className="flex items-center gap-2 text-sm text-lavender">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect
                    x="2.5"
                    y="5.5"
                    width="19"
                    height="13"
                    rx="3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
                </svg>
                YouTube
              </span>
              {YOUTUBE_CHANNELS.map((c) => (
                <a
                  key={c.handle}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press -my-1.5 w-fit py-1.5 text-sm text-lavender-dim hover:text-porcelain"
                >
                  {c.name}{" "}
                  <span className="text-lavender-dim/70">{c.handle}</span>
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Quick links" className="col-span-12 flex flex-col gap-3 sm:col-span-6 md:col-span-3">
            <span className="mb-1 font-display track-caption text-lg text-porcelain">
              Quick links
            </span>
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                // py/-my is exactly half the 12px column gap, so the hit box
                // grows from 22px to 34px and adjacent targets abut without
                // overlapping. No visual pixel moves.
                className="press -my-1.5 w-fit py-1.5 text-sm text-lavender-dim hover:text-porcelain"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Products" className="col-span-12 flex flex-col gap-3 sm:col-span-6 md:col-span-3">
            <span className="mb-1 font-display track-caption text-lg text-porcelain">
              Products
            </span>
            {PRODUCT_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                // py/-my is exactly half the 12px column gap, so the hit box
                // grows from 22px to 34px and adjacent targets abut without
                // overlapping. No visual pixel moves.
                className="press -my-1.5 w-fit py-1.5 text-sm text-lavender-dim hover:text-porcelain"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 py-8 text-sm leading-relaxed text-lavender-dim md:flex-row md:items-start md:justify-between">
          {/* The page markets five categories, so the disclaimer has to cover
              five. This is the reviewed string from lib/products.tsx, reused
              rather than re-worded. */}
          <p className="max-w-[58ch] text-vibrant">{RISK_DISCLAIMER}</p>
          <div className="flex flex-col gap-1 md:items-end">
            <span className="text-brass">
              AMFI-registered mutual fund distributor · ARN 341407
            </span>
            <span>© 2026 Platizio Services LLP. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* watermark */}
      <div
        aria-hidden
        className="pointer-events-none select-none px-4 text-center font-display track-display text-[clamp(5rem,18vw,17rem)] leading-[0.9] text-lavender/[0.045]"
      >
        Platizio
      </div>
    </footer>
  );
}
