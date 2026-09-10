import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "./routes";

/**
 * Link integrity. Internal links are resolved against the running build;
 * external hosts are only checked for shape (protocol, rel) so the suite stays
 * offline-safe and deterministic.
 */

test("every internal link resolves to a real page", async ({ page, request }) => {
  const broken: string[] = [];
  const checked = new Set<string>();

  for (const route of ALL_ROUTES) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href]", (as) =>
      as.map((a) => a.getAttribute("href")!).filter((h) => h.startsWith("/")),
    );
    for (const href of new Set(hrefs)) {
      const key = href;
      if (checked.has(key)) continue;
      checked.add(key);
      const res = await request.get(href);
      if (res.status() >= 400) broken.push(`${href} → HTTP ${res.status()} (linked from ${route})`);
    }
  }
  expect(broken, "broken internal links").toEqual([]);
});

test("every external link is https and carries rel=noopener", async ({ page }) => {
  const problems: string[] = [];
  for (const route of ALL_ROUTES) {
    await page.goto(route);
    const links = await page.$$eval('a[href^="http"]', (as) =>
      as.map((a) => ({
        href: a.getAttribute("href")!,
        target: a.getAttribute("target"),
        rel: a.getAttribute("rel") ?? "",
      })),
    );
    for (const l of links) {
      if (l.href.startsWith("http://")) problems.push(`${route}: insecure ${l.href}`);
      if (l.target === "_blank" && !l.rel.includes("noopener"))
        problems.push(`${route}: ${l.href} opens a new tab without rel=noopener`);
    }
  }
  expect(problems, "external link hygiene").toEqual([]);
});

test("links that open a new tab say so", async ({ page }) => {
  // WCAG 3.2.5 / G201: a link that leaves the site in a new tab should warn,
  // otherwise Back appears broken to screen-reader and low-vision users.
  const silent: string[] = [];
  for (const route of ["/contact", "/insights"]) {
    await page.goto(route);
    const links = await page.$$eval('a[target="_blank"]', (as) =>
      as.map((a) => ({
        href: a.getAttribute("href")!,
        label: (a.getAttribute("aria-label") ?? a.textContent ?? "").toLowerCase(),
      })),
    );
    for (const l of links) {
      if (!/new tab|new window|opens in/.test(l.label)) silent.push(`${route}: ${l.href}`);
    }
  }
  expect(silent, "new-tab links with no warning").toEqual([]);
});

test("the primary CTA uses client-side navigation", async ({ page }) => {
  // MagneticButton renders a bare <a>, so "Book a consultation" triggers a full
  // document load instead of a Next.js client transition — the whole bundle,
  // fonts and CSS are re-fetched on the site's most important click.
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.querySelector("[data-intro-curtain]"), null, { timeout: 6000 }).catch(() => {});

  // Target the hero CTA specifically. `.first()` would resolve to the header's
  // next/link on desktop and the hero's bare <a> on mobile, which made this
  // test pass or fail on viewport rather than on the defect.
  const heroCta = page
    .locator('section#top a[href="/contact"]')
    .filter({ hasText: /book a consultation/i })
    .first();
  await expect(heroCta).toBeVisible();

  // Mark the document; a client-side transition preserves it, a full load does not.
  await page.evaluate(() => { (window as unknown as Record<string, unknown>).__spaMarker = true; });
  await heroCta.click();
  await page.waitForURL("**/contact");

  const survived = await page.evaluate(() => Boolean((window as unknown as Record<string, unknown>).__spaMarker));
  expect(survived, "primary CTA performed a full page reload instead of a client transition").toBe(true);
});
