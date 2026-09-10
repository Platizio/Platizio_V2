/**
 * The site's public URL surface, kept in one place so every spec walks the
 * same list. Mirrors `generateStaticParams` in the two dynamic segments plus
 * the static routes; if a route is added there and not here, `routes.spec.ts`
 * fails on the sitemap/route-parity check rather than silently skipping it.
 */

export const STATIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/products",
  "/insights",
  "/privacy-policy",
  "/terms-and-condition",
  "/global-investing/privacy-policy",
  "/global-investing/terms-and-condition",
] as const;

export const PRODUCT_SLUGS = [
  "sif",
  "mutual-funds",
  "pms",
  "aif",
  "international",
] as const;

export const ARTICLE_SLUGS = [
  "why-sif-prominent-position-2026",
  "mutual-funds-evolving-good-thing-investors",
  "aifs-india-what-why-trend",
  "why-international-investing-matters-2026",
  "pms-explained-taxation-target-audience",
] as const;

export const PRODUCT_ROUTES = PRODUCT_SLUGS.map((s) => `/products/${s}`);
export const ARTICLE_ROUTES = ARTICLE_SLUGS.map((s) => `/insights/${s}`);

/** Every indexable page on the site. */
export const ALL_ROUTES: string[] = [
  ...STATIC_ROUTES,
  ...PRODUCT_ROUTES,
  ...ARTICLE_ROUTES,
];

/** Pages whose ground is porcelain below the hero — where the brass focus
 *  ring is measured against a light background. */
export const LIGHT_GROUND_ROUTES = [
  "/contact",
  "/products",
  "/insights",
  "/privacy-policy",
  ...ARTICLE_ROUTES,
];
