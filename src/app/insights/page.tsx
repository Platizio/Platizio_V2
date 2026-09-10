import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/site";
import InsightsIndex from "@/components/pages/InsightsIndex";

/**
 * Declared as constants rather than written twice, because Open Graph cannot
 * inherit the page's own `title` and `description` — it needs its own copies —
 * and two literals of the same sentence in one file is one of them going stale
 * the next time the copy is revised.
 */
const TITLE = "Media Insights | Platizio";
const DESCRIPTION =
  "Stay informed with Platizio's latest articles, market analysis and educational content across SIF, mutual funds, AIF, PMS and international investing.";

/** This route's own path. Used for both the canonical link and `og:url`, which
 *  must agree: resolved against `metadataBase` in `app/layout.tsx`. */
const PATH = "/insights";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,

  /**
   * Both are per-route by necessity, not preference (audit finding M-03).
   * Metadata merges *shallowly*, so a canonical in the root layout would have
   * all 19 routes claim the homepage as canonical, and this `openGraph`
   * replaces the root layout's object wholesale — without the `OG_DEFAULTS`
   * spread the page ships with no `og:site_name`, `og:locale` or `og:type`.
   * The full reasoning is on `OG_DEFAULTS` in `lib/site.ts`.
   *
   * `og:type` stays "website" from `OG_DEFAULTS`: this is the index, not a
   * piece of writing. Only `insights/[slug]` overrides it to "article".
   */
  alternates: { canonical: PATH },
  openGraph: {
    ...OG_DEFAULTS,
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
  },
};

export default function Page() {
  return <InsightsIndex />;
}
