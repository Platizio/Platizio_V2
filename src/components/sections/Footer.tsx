import Link from "next/link";
import { RISK_DISCLAIMER } from "@/lib/products";
import { LEGAL_NAME, YOUTUBE_CHANNELS } from "@/lib/site";

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

/**
 * The year on the copyright line, resolved once when this module is first
 * evaluated — which, for a site whose 22 pages are all prerendered, means at
 * `next build`. It replaces a literal `2026` that was right the day it was
 * typed and wrong from the following 1 January.
 *
 * Build year, deliberately, not the reader's year. A prerendered page has no
 * request-time clock, so printing the *reader's* year would mean either opting
 * this route out of static rendering or making the global footer a Client
 * Component and correcting the date in an effect after hydration. The first
 * trades the entire static build for a number; the second ships the footer to
 * every visitor's bundle to fix a mismatch it created. Neither is worth it,
 * and the build year is the more defensible claim anyway: a copyright notice
 * marks when the work was published, and this HTML is published at build time.
 * The consequence to know is that the year advances on the next deploy rather
 * than at midnight on 1 January — if that ever looks stale, the fix is a
 * rebuild, not an edit here.
 *
 * One Next.js 16 caveat, should this project ever enable Cache Components:
 * under that flag synchronous IO during prerender — `new Date()`, `Date.now()`,
 * `Math.random()` — is a hard build error rather than a baked-in value, and the
 * migration guide is explicit that opting a segment out with `instant = false`
 * does not clear it. `next.config.ts` does not set the flag today, so this is
 * safe as written; if it is ever set, this line is one of the things that has
 * to move behind `<Suspense>` + `connection()` or into a Client Component.
 */
const COPYRIGHT_YEAR = new Date().getFullYear();

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
              {/* The handle used to be dimmed a second time — a span of
                  `text-lavender-dim/70` inside a link already set to
                  `text-lavender-dim` — to rank it below the channel name.
                  Composited on midnight that lands at 4.17:1, under the 4.5:1
                  WCAG 1.4.3 asks of text this size, and because the footer is
                  global it failed on all 19 routes. The bare token measures
                  7.51:1 on the same ground, so the span had nothing left to
                  carry and the handle now simply inherits from the link —
                  which also means the whole line lifts to porcelain on hover
                  instead of the name lifting and the handle staying behind.

                  These three are the only links in the footer that leave the
                  site, and they open in a new tab. Unannounced, a screen
                  reader user hears the channel name, follows it, and finds
                  Back inert in a window with no history (WCAG 3.2.5, technique
                  G201); the same surprise hits anyone magnified far enough not
                  to see the new tab appear. The warning sits inside the anchor
                  so it joins the accessible name rather than floating next to
                  it, and `sr-only` keeps it out of the visual line. The
                  existing rel="noopener noreferrer" is the other half of this
                  and is already correct. */}
              {YOUTUBE_CHANNELS.map((c) => (
                <a
                  key={c.handle}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press -my-1.5 w-fit py-1.5 text-sm text-lavender-dim hover:text-porcelain"
                >
                  {c.name} {c.handle}
                  <span className="sr-only"> (opens in a new tab)</span>
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
            <span>
              © {COPYRIGHT_YEAR} {LEGAL_NAME}. All rights reserved.
            </span>
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
