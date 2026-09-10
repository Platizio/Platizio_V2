import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ALL_ROUTES } from "./routes";
import { contrast, focusIndicatorColors, groundBehind, toRgb } from "./color";

/**
 * Accessibility. The axe scan is the floor, not the ceiling — the checks below
 * it cover the things axe cannot see: whether a keyboard can reach a scroll
 * container, whether the focus ring is actually visible against the ground it
 * lands on, and whether the mobile sheet behaves like a dialog.
 */

/**
 * The scan runs under `prefers-reduced-motion: reduce` — for accuracy, not
 * leniency.
 *
 * With motion on, the entrance animations are still running when axe reads the
 * page, and it measures whichever frame it catches: a
 * `<span data-reveal="true" style="opacity: 0">` composites to #332828 over
 * the midnight ground and is reported as a 1.37:1 contrast violation — for
 * text that is fully legible a moment later. That produced 29 "violations" on
 * the homepage alone and at least one on every other route, none of them
 * describing anything a reader ever sees. It is the same class of measurement
 * error as reading a colour before its transition has ended.
 *
 * Reduced motion is the site's own settled rendering: every [data-reveal] sits
 * at opacity 1 from the first paint. The guard below asserts exactly that, so
 * the premise this scan rests on cannot quietly stop being true.
 *
 * What genuinely goes untested here is the contrast of text mid-animation, and
 * that is not a WCAG requirement — 1.4.3 applies to text as presented.
 */
test.describe("axe", () => {
  test.use({ reducedMotion: "reduce" });

  for (const route of ALL_ROUTES) {
    test(`axe: ${route} has no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      // The intro curtain covers the homepage until webfonts resolve; scanning
      // underneath it would measure a violet rectangle.
      await page.waitForFunction(() => !document.querySelector("[data-intro-curtain]"), null, {
        timeout: 5000,
      }).catch(() => {});

      const unsettled = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
          (el) => parseFloat(getComputedStyle(el).opacity) < 0.99,
        ).length,
      );
      expect(
        unsettled,
        `${route}: reveals are still animating under reduced motion, so every colour measured below is an animation frame`,
      ).toBe(0);

      const results = await new AxeBuilder({ page })
        // The single node held out of the scan: the enormous, near-invisible
        // "Platizio" wordmark the footer lays behind its content. It is
        // aria-hidden, pointer-events-none and unselectable — pure decoration,
        // which 1.4.3 exempts from the contrast minimum and which axe has no
        // way to recognise, so it reported 1.07:1 on all 19 routes. It is held
        // out by those decorative attributes rather than by a hand-written
        // path, so no real text can inherit the exemption by moving under it.
        .exclude('[aria-hidden="true"].select-none')
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}) ×${v.nodes.length} — ${v.help}\n     ${v.nodes[0]?.target?.join(" ")}`,
      );
      expect(summary, `axe violations on ${route}`).toEqual([]);
    });
  }
});

test("a skip link lets a keyboard bypass the nav", async ({ page }) => {
  // WCAG 2.4.1 Bypass Blocks (Level A). The nav is fixed and repeats on every
  // page; without a skip link a keyboard user tabs through it every time.
  await page.goto("/about");
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el ? { tag: el.tagName, text: (el.textContent ?? "").trim(), href: el.getAttribute("href") } : null;
  });
  expect(first, "something should receive focus on first Tab").not.toBeNull();
  expect(
    `${first!.text} ${first!.href ?? ""}`.toLowerCase(),
    "the first tab stop should be a skip-to-content link",
  ).toMatch(/skip|#main|#content|#top/);
});

test("horizontally scrollable tables are reachable by keyboard", async ({ page }) => {
  // WCAG 2.1.1. A container that scrolls but holds no focusable content needs
  // tabindex="0" (and an accessible name) or a keyboard user cannot pan it.
  const offenders: string[] = [];
  for (const route of ["/products/pms", "/insights/pms-explained-taxation-target-audience"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const bad = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>("*")) {
        const style = getComputedStyle(el);
        const scrolls =
          (style.overflowX === "auto" || style.overflowX === "scroll") &&
          el.scrollWidth > el.clientWidth + 1;
        if (!scrolls) continue;
        const focusableInside = el.querySelector("a,button,input,select,textarea,[tabindex]");
        if (!focusableInside && !el.hasAttribute("tabindex")) {
          out.push(el.className || el.tagName);
        }
      }
      return out;
    });
    if (bad.length) offenders.push(`${route}: ${bad.join(" | ")}`);
  }
  expect(offenders, "scrollable regions with no keyboard access").toEqual([]);
});

test("the focus ring is visible on both grounds", async ({ page }) => {
  // 1.4.11: a focus indicator needs 3:1 against the ground it lands on. The
  // indicator is two-tone — a brass outline for midnight, a midnight shadow
  // ring for porcelain — so it passes if *either* ring clears 3:1 here.
  const cases: { route: string; selector: string; where: string }[] = [
    { route: "/contact", selector: "#name", where: "form field on porcelain" },
    // The wordmark, not a nav link: the desktop nav is display:none below lg,
    // and an element that isn't rendered paints no focus ring to measure.
    { route: "/about", selector: 'header a[href="/"]', where: "wordmark on midnight" },
    // Matched on its own text, not `a[href="/contact"]`, which would resolve to
    // the header CTA — also hidden below lg — before reaching the prose link.
    { route: "/privacy-policy", selector: "main p a[href='/contact']", where: "prose link on porcelain" },
  ];

  for (const c of cases) {
    await page.goto(c.route, { waitUntil: "networkidle" });
    await page.locator(c.selector).first().focus();

    const groundCss = await groundBehind(page, c.selector);
    const ground = await toRgb(page, groundCss);
    const rings = await focusIndicatorColors(page, c.selector);
    expect(rings.length, `${c.where}: no focus indicator painted at all`).toBeGreaterThan(0);

    const ratios = await Promise.all(
      rings.map(async (r) => contrast(await toRgb(page, r, groundCss), ground)),
    );
    const best = Math.max(...ratios);
    expect(
      best,
      `${c.where}: best ring measured ${best.toFixed(2)}:1 (rings ${rings.join(", ")} on ${groundCss}), needs 3:1`,
    ).toBeGreaterThanOrEqual(3);
  }
});

test("outline buttons have a boundary visible at 3:1", async ({ page }) => {
  // 1.4.11 again, in the dark palette. The `outline-light` variant has no fill,
  // so its border IS the control — and axe does not check non-text contrast on
  // borders, which is how this one survived a clean axe run.
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.querySelector("[data-intro-curtain]"), null, { timeout: 6000 }).catch(() => {});

  const cta = page.locator('section#top a[href="#products"]').first();
  await expect(cta).toBeVisible();

  const borderCss = await cta.evaluate((el) => getComputedStyle(el).borderTopColor);
  const groundCss = await groundBehind(page, 'section#top a[href="#products"]');
  const ratio = contrast(
    await toRgb(page, borderCss, groundCss),
    await toRgb(page, groundCss),
  );
  expect(
    ratio,
    `outline-light border ${borderCss} on ${groundCss} measured ${ratio.toFixed(2)}:1, needs 3:1`,
  ).toBeGreaterThanOrEqual(3);
});

test("form inputs have a boundary visible at 3:1", async ({ page }) => {
  // 1.4.11: the only affordance marking these fields is a bottom border.
  await page.goto("/contact", { waitUntil: "networkidle" });
  const borderCss = await page.locator("#name").evaluate(
    (el) => getComputedStyle(el).borderBottomColor,
  );
  const groundCss = await groundBehind(page, "#name");
  const ratio = contrast(
    await toRgb(page, borderCss, groundCss),
    await toRgb(page, groundCss),
  );
  expect(
    ratio,
    `input border ${borderCss} on ${groundCss} measured ${ratio.toFixed(2)}:1, needs 3:1`,
  ).toBeGreaterThanOrEqual(3);
});

test("mobile menu behaves like a dialog", async ({ page, isMobile }) => {
  test.skip(!isMobile, "the sheet only exists below lg");
  await page.goto("/about", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", { name: /open menu/i });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: /site menu/i });
  await expect(dialog).toBeVisible();

  // Focus should land inside the sheet.
  const inside = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return !!d && d.contains(document.activeElement);
  });
  expect(inside, "focus should move into the sheet on open").toBe(true);

  // aria-modal="true" tells assistive tech everything outside the dialog is
  // unavailable — so the only way to close it must also be inside it.
  const closeInside = await dialog.getByRole("button", { name: /close/i }).count();
  expect(closeInside, "an aria-modal dialog needs its own close control").toBeGreaterThan(0);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
