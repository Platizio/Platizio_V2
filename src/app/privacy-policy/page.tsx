import type { Metadata } from "next";
import { getLegalDoc, type LegalDoc } from "@/lib/legal";
import { OG_DEFAULTS } from "@/lib/site";
import LegalPage from "@/components/pages/LegalPage";

/** The `LEGAL_DOCS` key this route renders. */
const DOC_ID = "privacy-policy";

const entry = getLegalDoc(DOC_ID);

/**
 * Checked, not asserted (audit finding L-14). This was `getLegalDoc(DOC_ID)!`,
 * which told the compiler to stop caring: a renamed or mistyped key stopped
 * being a type error and became `undefined` flowing into `doc.title` a few
 * lines down, so `next build` died on "Cannot read properties of undefined
 * (reading 'title')" — a message naming neither the id that was wrong nor the
 * route that asked for it. This names both, and it throws at import time, so
 * the failure arrives before any page is prerendered rather than in the middle
 * of one.
 *
 * The narrowed value is then re-bound with an explicit `LegalDoc` annotation.
 * That is not ceremony: TypeScript drops a narrowing when the variable is read
 * inside a function body declared later, so `Page` below would still see
 * `LegalDoc | undefined` if it closed over `entry` directly.
 */
if (!entry) {
  throw new Error(
    `No legal document is registered under the id "${DOC_ID}" ` +
      `(see LEGAL_DOCS in src/lib/legal.ts). ` +
      `src/app/privacy-policy/page.tsx cannot render without it.`,
  );
}
const doc: LegalDoc = entry;

/** Declared once because Open Graph needs its own copy of the title and a
 *  second literal is one of them going stale. */
const TITLE = `${doc.title} | Platizio`;

export const metadata: Metadata = {
  title: TITLE,
  description: doc.subtitle,

  /**
   * Both are per-route by necessity, not preference (audit finding M-03).
   * Metadata merges *shallowly*, so a canonical in the root layout would have
   * all 19 routes claim the homepage as canonical, and this `openGraph`
   * replaces the root layout's object wholesale — without the `OG_DEFAULTS`
   * spread the page ships with no `og:site_name`, `og:locale` or `og:type`.
   * The full reasoning is on `OG_DEFAULTS` in `lib/site.ts`.
   *
   * The path is read off the registry entry rather than written as a literal,
   * so the URL this page declares as its own cannot drift from the one the
   * document says it lives at — the same field the footer links from.
   */
  alternates: { canonical: doc.path },
  openGraph: {
    ...OG_DEFAULTS,
    title: TITLE,
    description: doc.subtitle,
    url: doc.path,
  },
};

export default function Page() {
  return <LegalPage doc={doc} />;
}
