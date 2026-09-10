import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

/**
 * XML sitemap for the 19 indexable routes (audit finding M-02 — the site had
 * neither a sitemap nor a robots.txt, so every route had to be discovered by
 * crawling links).
 *
 * The product and article URLs are derived from the same `PRODUCTS` and
 * `ARTICLES` registries that `generateStaticParams` builds the pages from,
 * never listed by hand. That is the point: a hand-written list would keep
 * advertising a removed article — the four placeholder Insights notes deleted
 * in 1e01935 would still be in here — or silently omit a new one. Deriving it
 * makes the sitemap incapable of disagreeing with the routes that build.
 *
 * Not in here, deliberately: `/sitemap.xml` and `/robots.txt` themselves, and
 * nothing else exists. There are no noindex routes to exclude.
 *
 * `MetadataRoute.Sitemap` entries are plain data, evaluated once at build
 * time — no request-time API is touched, so this stays a static route and the
 * 22/22 prerender is unaffected.
 */

/**
 * `new URL(path, base)` rather than string concatenation, so a stray double
 * slash is impossible and the composition matches how `metadataBase` resolves
 * the same relative paths in `app/layout.tsx`. The root becomes
 * "https://www.platizio.com/"; every other route has no trailing slash, which
 * is what Next.js serves with the default `trailingSlash: false`.
 */
const url = (path: string) => new URL(path, SITE_URL).toString();

/**
 * `changeFrequency` and `priority` are hints, not facts: Google ignores both,
 * and other crawlers treat them as the site owner's opinion of relative
 * importance. They are set to that opinion — the homepage above the section
 * indexes, the section indexes above individual products and articles, legal
 * text at the bottom because it changes rarely and is not what anyone
 * searches for.
 *
 * `lastModified` is omitted everywhere it is not actually known. Articles have
 * a real publication date in `ARTICLES[].iso`; the marketing and legal pages
 * have no tracked revision date, and stamping them with the build time would
 * tell crawlers all 14 changed on every deploy — a lastmod that is provably
 * unreliable is discounted wholesale, taking the articles' honest dates with
 * it. If the legal documents ever gain a reviewed-on date, it belongs here.
 */
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  // `SITE_URL` directly, not `url("/")`. `new URL("/", origin)` appends the
  // trailing slash, and the homepage's own canonical — `alternates.canonical:
  // "/"` in app/page.tsx — resolves without one. Two spellings of the same
  // page is exactly the ambiguity a canonical exists to remove, so the sitemap
  // states the one the canonical does.
  { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
  { url: url("/about"), changeFrequency: "monthly", priority: 0.8 },
  { url: url("/products"), changeFrequency: "monthly", priority: 0.8 },
  { url: url("/insights"), changeFrequency: "monthly", priority: 0.8 },
  { url: url("/contact"), changeFrequency: "yearly", priority: 0.8 },
  { url: url("/privacy-policy"), changeFrequency: "yearly", priority: 0.3 },
  { url: url("/terms-and-condition"), changeFrequency: "yearly", priority: 0.3 },
  {
    url: url("/global-investing/privacy-policy"),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: url("/global-investing/terms-and-condition"),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES,
    ...PRODUCTS.map((product) => ({
      url: url(`/products/${product.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...ARTICLES.map((article) => ({
      url: url(`/insights/${article.slug}`),
      // The publication date, which is the only modification date the site
      // records. Articles are edited in place rather than re-dated, so this
      // is a floor on freshness, not a claim about the last keystroke.
      lastModified: article.iso,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
