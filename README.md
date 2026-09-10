# Platizio

Marketing and content site for **Platizio Services LLP** — an AMFI-registered mutual
fund distributor (ARN 341407) in India, covering five product categories: Mutual
Funds, PMS, AIF, SIF and International Investing.

The site is a fully prerendered brochure. There is no backend, no database and no
authentication: every one of its 25 routes is static HTML built at deploy time, and
the contact form hands off to WhatsApp or the reader's mail client rather than
posting anywhere.

## Requirements

- Node.js 20+
- npm

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build. Should report **25 static routes and zero dynamic ones** — a route rendering as `ƒ` is a regression |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint. Read the reported problem count, not the exit code — it exits 0 with warnings present |
| `npm test` | Playwright suite across three viewports |
| `npm run test:report` | Open the last HTML test report |

## Architecture

```
src/
  app/                  routes, metadata, sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    sections/           homepage sections (Hero, Manifesto, Products, Journey, Trust, Footer)
    pages/              one component per interior page
    site/               shared chrome — SiteShell, PageHero, RichText, ProductBlocks
    ui/                 Reveal, MagneticButton
  content/
    articles/           Media Insights article bodies
    legal/              the four legal documents
  lib/
    site.ts             single source of truth for URL, contacts, offices, channels
    products.tsx        product registry — drives /products and the sitemap
    articles.ts         article registry — drives /insights and the sitemap
    motion.ts           spring presets; see the note in the file on Apple's two dials
```

Long-form content (articles and legal documents) is authored as typed `RichBlock`
arrays and rendered by `RichText`, so prose styling is defined once.

## Testing

```bash
npm test
```

The suite covers route health, accessibility (axe plus checks axe cannot make —
focus-ring contrast, keyboard-reachable scroll containers, modal behaviour), SEO
metadata, link integrity and the contact form.

Two things worth knowing before you change it:

- **The axe scan runs under `prefers-reduced-motion: reduce`,** and must keep doing
  so. With motion enabled, axe measures elements mid-animation and reports contrast
  failures for text that is perfectly legible a moment later — it produced 288 such
  false positives against 3 real ones. Reduced motion is this site's own settled
  rendering, so it is the accurate state to measure.
- **`playwright.config.ts` uses `channel: "chrome"`,** the locally installed browser.
  On CI, drop that line and run `npx playwright install --with-deps chromium` in the
  setup step instead.

## Before deploying

- **Attach the domain, then set `NEXT_PUBLIC_SITE_URL`.** The production origin is
  `https://www.platizio.com` — confirmed: the apex 301s to `www`, and `www` serves
  200 with no further redirect. But the site currently deploys to
  `platizio-v2.vercel.app` while `www.platizio.com` still serves the legacy site,
  so `SITE_URL` resolves per deployment (see `src/lib/site.ts`) and any build that
  is not on the brand domain marks itself `noindex` and self-canonicalises rather
  than claiming to be production. Set `NEXT_PUBLIC_SITE_URL=https://www.platizio.com`
  in Vercel's production environment when the cutover happens; nothing else needs
  changing, because the `noindex` is derived from the resolved origin.
- **Confirm security headers survive your host.** They are set in `next.config.ts`
  and verified by a request against `next start`; a CDN or proxy in front can strip
  or override them.
- **The legal documents and article figures still need review.** Both are ported
  verbatim from the legacy site. `src/lib/legal.ts` and `src/lib/articles.ts` carry
  the notes; the `lastUpdated` date shown on each legal page is the date its text
  last changed in this repository, not a reviewed effective date.

## Regulatory note

This site is published by an AMFI-registered **distributor**, not a SEBI-registered
intermediary. Copy must not make or imply a return claim — "superior returns",
"guaranteed", "assured", "outperform" — and must not describe the firm itself as
SEBI-registered; the products are SEBI-regulated, the firm distributes them.
`tests/seo.spec.ts` fails the build if the site description reacquires such a claim.
