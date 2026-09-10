import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "./routes";

/**
 * Horizontal overflow.
 *
 * The suite pinned a great deal about these pages — links, titles, contrast,
 * focus rings — and nothing at all about whether they fit the screen. That is
 * the one defect a reader on a phone cannot miss and cannot work around: the
 * page slides sideways under the thumb, the fixed nav detaches from the
 * content, and every centred section looks off-axis.
 *
 * It is also the defect most likely to arrive by accident. A single
 * `w-[420px]`, a `whitespace-nowrap` on a heading that later grows a longer
 * word, a grid child without `min-w-0`, or `100vw` used where `100%` was meant
 * will each do it, and none of them fails a type check, a lint rule or any
 * other test here.
 *
 * Measured rather than eyeballed: `scrollWidth` against `clientWidth` on the
 * document element. A 1px tolerance absorbs sub-pixel rounding on fractional
 * device pixel ratios, which is real and is not overflow.
 *
 * The 404 is in the sweep alongside the real routes. It renders the same
 * chrome as every other page, so it can break the same way, and nothing else
 * in the suite lays it out.
 */

/**
 * The widths that matter, and why each is here rather than a round number:
 *
 *  320  the narrowest phone still in use (iPhone SE 1st gen, and Android
 *       small-screen mode). Anything that fits here fits everywhere.
 *  360  the single most common Android viewport.
 *  390  iPhone 12–15 class.
 *  768  the md: breakpoint boundary — layouts change shape exactly here.
 * 1024  the lg: boundary, where the desktop grid takes over.
 * 1100  inside the 1024–1200 band, where this layout's columns are far
 *       narrower than at 1400 and where breakage hides. It is why
 *       playwright.config.ts carries a `laptop-narrow` project at all.
 * 1440  the reference desktop width the design is drawn at.
 */
const WIDTHS = [320, 360, 390, 768, 1024, 1100, 1440] as const;

const ROUTES = [...ALL_ROUTES, "/this-route-does-not-exist"];

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const overflowing: string[] = [];

    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: "networkidle" });

      const result = await page.evaluate(() => {
        const de = document.documentElement;
        const scrollWidth = Math.max(de.scrollWidth, document.body.scrollWidth);
        const over = scrollWidth - de.clientWidth;
        if (over <= 1) return { over, culprits: [] as string[] };

        /**
         * Name the element, not just the number. An assertion that says
         * "the page is 40px too wide" sends the next reader hunting; one that
         * says which box sticks out points straight at the class to fix.
         * Elements are reported deepest-last, so the final entries are the
         * most specific.
         */
        const culprits: string[] = [];
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right + window.scrollX > de.clientWidth + 1) {
            culprits.push(
              `<${el.tagName.toLowerCase()} class="${(
                el.getAttribute("class") ?? ""
              ).slice(0, 90)}"> right=${Math.round(r.right)}`,
            );
          }
        }
        return { over, culprits: culprits.slice(-4) };
      });

      if (result.over > 1) {
        overflowing.push(
          `${route} overflows by ${result.over}px — ${result.culprits.join(" | ")}`,
        );
      }
    }

    expect(overflowing, `horizontal overflow at ${width}px`).toEqual([]);
  });
}
