import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/site";
import ProductsIndex from "@/components/pages/ProductsIndex";

/**
 * Declared as constants rather than written twice, because Open Graph cannot
 * inherit the page's own `title` and `description` — it needs its own copies —
 * and two literals of the same sentence in one file is one of them going stale
 * the next time the copy is revised.
 */
const TITLE = "Products | Platizio";

/**
 * 152 characters. The previous wording ("Explore Platizio's regulated product
 * line-up — Specialised Investment Funds, Mutual Funds, Portfolio Management
 * Services, Alternative Investment Funds and International Investing.") was
 * 179, past the ~160 a search result shows and the only route failing the
 * length half of the SEO suite's title/description check (audit finding L-05).
 * Google would have cut it mid-name, at "Alternative Investment F…".
 *
 * Nothing is lost by the trim: "PMS" and "AIF" are how the market — and
 * `SITE_DESCRIPTION` in `lib/site.ts` — already name those two, each product's
 * own page carries the expansion in its `metaTitle`, and the sentence now
 * spends its last clause on what a reader actually wants to know. No return
 * claim, in keeping with the note on `SITE_DESCRIPTION`: "meant for" is a
 * suitability statement, which is what a distributor may say.
 */
const DESCRIPTION =
  "Platizio's regulated product line-up — Specialised Investment Funds, mutual funds, PMS, AIF and international investing — and who each one is meant for.";

/** This route's own path. Used for both the canonical link and `og:url`, which
 *  must agree: resolved against `metadataBase` in `app/layout.tsx`. */
const PATH = "/products";

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
  return <ProductsIndex />;
}
