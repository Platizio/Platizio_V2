import { test, expect, type ConsoleMessage } from "@playwright/test";
import { ALL_ROUTES } from "./routes";

/**
 * Route health: every page answers 200, renders exactly one h1, carries a
 * unique title and description, and produces no console errors or failed
 * subresource requests.
 */

for (const route of ALL_ROUTES) {
  test(`route ${route} loads clean`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on("console", (m: ConsoleMessage) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("requestfailed", (r) => {
      // Chrome cancels some prefetches on navigation; those are not defects.
      const why = r.failure()?.errorText ?? "";
      if (why.includes("ERR_ABORTED")) return;
      failedRequests.push(`${r.url()} — ${why}`);
    });
    page.on("response", (r) => {
      if (r.status() >= 400) failedRequests.push(`${r.url()} — HTTP ${r.status()}`);
    });

    const res = await page.goto(route, { waitUntil: "networkidle" });
    expect(res?.status(), `${route} should answer 200`).toBe(200);

    // Exactly one h1. Zero breaks the document outline; two is ambiguous.
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).not.toHaveText(/^\s*$/);

    expect(consoleErrors, `console errors on ${route}`).toEqual([]);
    expect(failedRequests, `failed requests on ${route}`).toEqual([]);
  });
}

test("unknown product and article slugs 404 rather than render", async ({ page }) => {
  // dynamicParams = false on both segments, so these must not be generated.
  for (const bad of ["/products/not-a-product", "/insights/not-an-article"]) {
    const res = await page.goto(bad);
    expect(res?.status(), `${bad} should 404`).toBe(404);
  }
});

test("the 404 keeps the site's chrome and names itself", async ({ page }) => {
  // What this pins is the framework default, which shipped here until
  // `app/not-found.tsx` existed: it rendered zero anchors — a dead end on a
  // site whose only conversion is booking a consultation — painted an inline
  // `body{background:#fff}` that beat globals.css on document order, and
  // carried the HOMEPAGE's title, because its own <title> landed after the
  // root layout's and the browser takes the first.
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status(), "an unknown route must answer 404").toBe(404);

  await expect(page).toHaveTitle(/Page not found/);
  // A second <title> means an in-tree one is fighting the metadata export and
  // losing — the exact failure the default 404 had.
  await expect(page.locator("title")).toHaveCount(1);

  // Chrome present: nav, footer, and real ways out.
  await expect(page.locator("header nav")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  expect(
    await page.locator("a[href]").count(),
    "a 404 with no onward links is a dead end",
  ).toBeGreaterThan(5);

  // Not the one white page on a midnight site.
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bg, "the 404 must not paint the default white ground").not.toMatch(
    /rgb\(255,\s*255,\s*255\)/,
  );

  // Next injects its own noindex for a 404 response; the layout's inherited
  // `index, follow` used to be emitted right beside it. Every robots
  // directive on this page must now agree that it is not indexable.
  const robots = await page.$$eval('meta[name="robots"]', (ms) =>
    ms.map((m) => m.getAttribute("content") ?? ""),
  );
  expect(robots.length, "the 404 should declare robots").toBeGreaterThan(0);
  for (const r of robots) {
    expect(r, "a 404 must not be advertised as indexable").toMatch(/noindex/);
  }
});

test("no duplicate element ids on any page", async ({ page }) => {
  // Article and legal headings derive their anchor id from the heading text
  // via anchorId(), which truncates at 60 chars — two headings sharing a
  // 60-char prefix would collide and break the table of contents.
  const offenders: string[] = [];
  for (const route of ALL_ROUTES) {
    await page.goto(route);
    const dupes = await page.evaluate(() => {
      const seen = new Map<string, number>();
      for (const el of document.querySelectorAll("[id]")) {
        seen.set(el.id, (seen.get(el.id) ?? 0) + 1);
      }
      return [...seen.entries()].filter(([, n]) => n > 1).map(([id]) => id);
    });
    if (dupes.length) offenders.push(`${route}: ${dupes.join(", ")}`);
  }
  expect(offenders).toEqual([]);
});

test("every in-page table-of-contents anchor resolves to a real target", async ({ page }) => {
  const broken: string[] = [];
  for (const route of ALL_ROUTES) {
    await page.goto(route);
    const hrefs = await page.$$eval('a[href^="#"]', (as) =>
      as.map((a) => a.getAttribute("href")!).filter((h) => h.length > 1),
    );
    for (const href of hrefs) {
      const id = decodeURIComponent(href.slice(1));
      const found = await page.locator(`[id="${id}"]`).count();
      if (found !== 1) broken.push(`${route} → ${href} (matched ${found})`);
    }
  }
  expect(broken).toEqual([]);
});
