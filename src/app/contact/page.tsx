import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/site";
import ContactPage from "@/components/pages/ContactPage";

/**
 * Declared as constants rather than written twice, because Open Graph cannot
 * inherit the page's own `title` and `description` — it needs its own copies —
 * and two literals of the same sentence in one file is one of them going stale
 * the next time the copy is revised.
 */
const TITLE = "Book a Consultation | Platizio";
const DESCRIPTION =
  "Book a consultation with Platizio. Tell us about your investment goals and reach our team on WhatsApp, by email or by phone.";

/** This route's own path. Used for both the canonical link and `og:url`, which
 *  must agree: resolved against `metadataBase` in `app/layout.tsx`. */
const PATH = "/contact";

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
  return <ContactPage />;
}
