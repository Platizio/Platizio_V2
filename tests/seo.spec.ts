import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "./routes";

/**
 * Search and social metadata. The site is a five-product financial
 * distributor: the product and article pages are the whole acquisition
 * surface, so a missing canonical or share card is a commercial defect, not a
 * cosmetic one.
 */

test("every route has a unique, non-empty title and description", async ({ page }) => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const route of ALL_ROUTES) {
    await page.goto(route);
    const title = await page.title();
    const desc =
      (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";

    expect(title.trim(), `${route} has a title`).not.toBe("");
    expect(title.length, `${route} title under 60 chars for SERP truncation`).toBeLessThanOrEqual(60);
    expect(desc.trim(), `${route} has a meta description`).not.toBe("");
    expect(desc.length, `${route} description under 160 chars`).toBeLessThanOrEqual(160);

    const dupeTitle = [...titles.entries()].find(([, t]) => t === title);
    expect(dupeTitle, `${route} title duplicates ${dupeTitle?.[0]}`).toBeUndefined();
    const dupeDesc = [...descriptions.entries()].find(([, d]) => d === desc);
    expect(dupeDesc, `${route} description duplicates ${dupeDesc?.[0]}`).toBeUndefined();

    titles.set(route, title);
    descriptions.set(route, desc);
  }
});

test("every route declares a canonical URL", async ({ page }) => {
  const missing: string[] = [];
  for (const route of ALL_ROUTES) {
    await page.goto(route);
    if ((await page.locator('link[rel="canonical"]').count()) === 0) missing.push(route);
  }
  expect(missing, "routes with no canonical link").toEqual([]);
});

test("every route has an Open Graph and Twitter card", async ({ page }) => {
  const missing: string[] = [];
  for (const route of ALL_ROUTES) {
    await page.goto(route);
    for (const sel of [
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:image"]',
      'meta[property="og:url"]',
      'meta[property="og:type"]',
      'meta[name="twitter:card"]',
    ]) {
      if ((await page.locator(sel).count()) === 0) missing.push(`${route} → ${sel}`);
    }
  }
  expect(missing, "missing share metadata").toEqual([]);
});

test("sitemap.xml exists and lists every route", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status(), "sitemap.xml should be served").toBe(200);
  const xml = await res.text();
  const missing = ALL_ROUTES.filter((r) => !xml.includes(r === "/" ? "</loc>" : `${r}<`));
  expect(missing, "routes absent from sitemap").toEqual([]);
});

test("robots.txt exists and points at the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status(), "robots.txt should be served").toBe(200);
  expect(await res.text()).toMatch(/sitemap:/i);
});

test("the organisation is described in structured data", async ({ page }) => {
  // A regulated financial distributor with two offices, a phone number and an
  // ARN is exactly what Organization/FinancialService JSON-LD is for.
  await page.goto("/");
  const blocks = await page.$$eval('script[type="application/ld+json"]', (s) =>
    s.map((n) => n.textContent ?? ""),
  );
  expect(blocks.length, "no JSON-LD on the homepage").toBeGreaterThan(0);
  const parsed = blocks.map((b) => JSON.parse(b));
  expect(
    parsed.some((p) => /Organization|FinancialService|LocalBusiness/.test(JSON.stringify(p["@type"]))),
    "no Organization-family JSON-LD",
  ).toBe(true);
});

test("articles carry Article structured data with a date", async ({ page }) => {
  await page.goto("/insights/why-sif-prominent-position-2026");
  const blocks = await page.$$eval('script[type="application/ld+json"]', (s) =>
    s.map((n) => JSON.parse(n.textContent ?? "{}")),
  );
  const article = blocks.find((b) => /Article|BlogPosting/.test(JSON.stringify(b["@type"])));
  expect(article, "no Article JSON-LD on an article page").toBeTruthy();
  expect(article.datePublished, "Article JSON-LD needs datePublished").toBeTruthy();
});

test("the site-wide description makes no performance claim", async ({ page }) => {
  // An AMFI-registered distributor may not imply assured or superior returns.
  await page.goto("/");
  const desc =
    (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
  expect(
    desc,
    "meta description implies a return outcome — AMFI code of conduct",
  ).not.toMatch(/superior returns|guaranteed|assured returns|best returns|high returns/i);
});

test("every route declares a tab icon, an iOS tile and a theme colour", async ({ page }) => {
  // Pinned per route, not on one page, because file-convention icons reach a
  // route only while no segment declares `metadata.icons` — Next applies the
  // collected static icons under `if (!resolvedMetadata.icons)`. A route that
  // later writes its own `icons` silently drops both links, the icon-shaped
  // twin of the shallow `openGraph` merge OG_DEFAULTS exists for.
  //
  // Before these existed the site shipped the create-next-app scaffold
  // favicon — a black disc with the Vercel triangle, untouched since the
  // first commit — as an AMFI-registered brand's tab icon, no apple-touch-icon
  // at all, and no theme-color, so Chrome on Android held a light toolbar
  // above a midnight page.
  const missing: string[] = [];
  for (const route of ALL_ROUTES) {
    await page.goto(route);
    if ((await page.locator('link[rel="icon"]').count()) === 0) {
      missing.push(`${route} → no rel=icon`);
    }
    if ((await page.locator('link[rel="apple-touch-icon"]').count()) === 0) {
      missing.push(`${route} → no apple-touch-icon`);
    }
    if ((await page.locator('meta[name="theme-color"]').count()) === 0) {
      missing.push(`${route} → no theme-color`);
    }
  }
  expect(missing, "routes missing an app icon or theme colour").toEqual([]);
});

test("the icon routes serve real images and /favicon.ico still answers", async ({ request }) => {
  for (const [path, bytes] of [
    ["/icon", 100],
    ["/apple-icon", 500],
  ] as const) {
    const res = await request.get(path);
    expect(res.status(), `${path} should serve`).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/image\/png/);
    expect((await res.body()).length, `${path} looks empty`).toBeGreaterThan(bytes);
  }

  // The scaffold .ico was deleted rather than left to win the tab — Next
  // unshifts a favicon to the FRONT of the resolved icon list, so keeping it
  // would have kept the Vercel triangle. Crawlers still probe the root path
  // blindly, so next.config.ts redirects it rather than 404ing.
  const ico = await request.get("/favicon.ico", { maxRedirects: 0 });
  expect(ico.status(), "/favicon.ico should redirect, not 404").toBe(308);
});
