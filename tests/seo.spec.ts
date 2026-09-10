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
