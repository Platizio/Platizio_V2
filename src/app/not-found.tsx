import type { Metadata } from "next";
import NotFoundPage from "@/components/pages/NotFoundPage";

/**
 * The 404 page.
 *
 * The root `not-found.tsx` is the one file that catches BOTH cases: an
 * unmatched URL anywhere in the app, and an explicit `notFound()` thrown from
 * a route segment — the bundled `not-found.md` states that the root file
 * "handles any unmatched URLs for your whole application". So the two dynamic
 * segments (`products/[slug]`, `insights/[slug]`) need no `not-found.tsx` of
 * their own: an unknown slug that is absent from `generateStaticParams` lands
 * here too.
 *
 * A server component over a client body, the same shape as every other route
 * here (`app/about/page.tsx` → `components/pages/AboutPage.tsx`), because the
 * chrome it renders is client-side. It renders inside the root layout, so the
 * Organization JSON-LD, the fonts and `globals.css` all apply without being
 * restated — which is exactly why this is a `not-found.tsx` and not the
 * experimental `global-not-found.tsx`, whose own doc notes it "bypasses your
 * app's normal rendering" and would need every one of those re-imported by
 * hand.
 *
 * What this replaces was the framework's own fallback, and it failed in three
 * ways at once, all measured against the running build: it rendered ZERO
 * anchors — a dead end on a site whose only conversion is "Book a
 * consultation" — it shipped an inline `body{color:#000;background:#fff}`
 * that beat `globals.css` on document order and made the 404 the one white
 * page on a midnight site, and it carried the HOMEPAGE's title, because the
 * fallback's own `<title>` lands after the root layout's in `<head>` and the
 * browser takes the first.
 */

/**
 * `not-found.tsx` DOES take a `metadata` export in this version, and it is the
 * only thing that can name this page.
 *
 * The app loader makes this file the page module of the `/_not-found` route —
 * `next-app-loader` emits it as `page:` for that subtree — so
 * `resolve-metadata` collects it through the same `getLayoutOrPageModule` path
 * it uses for any `page.tsx`. A `<title>` rendered in the component tree does
 * NOT work here: React 19 hoists it into `<head>`, but it lands *after* the
 * title the root layout's metadata emits, and `document.title` is the first
 * one in tree order. That is precisely why the framework default shipped
 * titled "Platizio — Navigate Every Market With Confidence".
 *
 * The title is written out in full rather than relying on a template:
 * `SITE_TITLE` in `lib/site.ts` is a plain string, not a
 * `{ default, template }` pair, so there is no "%s | Platizio" for a child to
 * slot into. This matches how `/insights` and the other routes spell theirs.
 *
 * `robots` is restated rather than inherited. Next injects
 * `<meta name="robots" content="noindex">` of its own for any page answering
 * 404 — but the root layout's `index, follow` was still emitted alongside it,
 * putting two contradicting directives on one document. Declaring it here
 * replaces the inherited one, so only the correct directive survives.
 *
 * No `alternates.canonical` and no `openGraph`, deliberately, unlike every
 * real route: a page that does not exist should not nominate a canonical URL
 * for itself or offer a share card for the address that failed.
 */
export const metadata: Metadata = {
  title: "Page not found | Platizio",
  description:
    "That page does not exist. Find our products, insights and contact details here.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundPage />;
}
