import type { Page } from "@playwright/test";

/**
 * Colour helpers for contrast assertions.
 *
 * These deliberately do NOT parse colour strings with a regex. This project's
 * palette is authored in `oklch()`, and Chrome serialises computed values in
 * whatever space they were authored in — `getComputedStyle` hands back
 * `oklab(0.6 0.006 -0.019)` and `lab(77.01 9.01 56.94)`, not `rgb()`. An
 * earlier version of these tests pulled the first three numbers out of the
 * string and treated them as 0–255 channels, which produced confident,
 * meaningless ratios (it read `oklab(0.599…)` as almost-black).
 *
 * Rasterising through a canvas is the reliable answer: whatever the notation,
 * `getImageData` returns actual sRGB bytes.
 */

/**
 * Paint a CSS colour over a known ground and read back its true sRGB bytes.
 *
 * `over` matters more than it looks. Half this palette is used at partial
 * opacity — `border-lavender/45`, `text-lavender-dim/70` — and a translucent
 * colour has no contrast ratio of its own; it only has one once composited
 * against what is behind it. An earlier version of this helper always painted
 * over opaque white, which made every translucent colour resolve light, and
 * every light-on-midnight comparison pass no matter what the alpha was. It
 * reported the `outline-light` button boundary as conformant at both 45% and
 * 30% opacity, when the real figures are 3.53:1 and 2.19:1 — a test that could
 * not fail. Always pass the actual ground when the colour may be translucent.
 */
export async function toRgb(
  page: Page,
  css: string,
  over = "#ffffff",
): Promise<[number, number, number]> {
  return page.evaluate(
    ([color, ground]) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = ground;
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]] as [number, number, number];
    },
    [css, over] as const,
  );
}

export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** The painted background behind an element, walking up past transparent ancestors. */
export async function groundBehind(page: Page, selector: string): Promise<string> {
  return page.evaluate((sel) => {
    let el: HTMLElement | null = document.querySelector(sel);
    while (el) {
      const c = getComputedStyle(el).backgroundColor;
      if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
      el = el.parentElement;
    }
    return "rgb(255, 255, 255)";
  }, selector);
}

/**
 * Every colour a focus indicator paints — the outline and any box-shadow ring.
 * A two-tone indicator only has to clear 3:1 on *one* of its rings for the
 * ground it is on, which is the whole point of using two.
 */
export async function focusIndicatorColors(page: Page, selector: string): Promise<string[]> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement;
    const cs = getComputedStyle(el);
    const colors: string[] = [];
    if (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) {
      colors.push(cs.outlineColor);
    }
    // box-shadow serialises as "<color> <offsets>"; the colour comes first and
    // may itself contain spaces and parens, so match the function call.
    const shadow = cs.boxShadow;
    if (shadow && shadow !== "none") {
      const m = shadow.match(/^(rgba?\([^)]*\)|(?:ok)?lab\([^)]*\)|(?:ok)?lch\([^)]*\)|color\([^)]*\)|#[0-9a-f]+)/i);
      if (m) colors.push(m[1]);
    }
    return colors;
  }, selector);
}
