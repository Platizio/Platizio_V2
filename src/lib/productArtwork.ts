import type { PRODUCT_GLYPHS } from "@/lib/productGlyphs";

/**
 * Artwork per instrument — the product's tag set as display type, lit in
 * violet with brass terminals, on its own midnight ground.
 *
 * Deliberately separate from PRODUCT_GLYPHS. Those are stroke SVGs drawn in
 * `currentColor`, and the Insights index still needs them: it tints a 44px
 * badge `brass-deep` on porcelain, where a dark raster plate would both
 * clash with the ground and be far too small to read a word in. Anywhere the
 * mark sits on midnight and has room to breathe, the artwork is the better
 * answer. The two sets answer to different constraints, so they coexist.
 *
 * Sources are 720x900 — 4:5, matching every frame that renders them, so
 * `object-cover` never crops.
 */
export const PANEL_ARTWORK: Record<keyof typeof PRODUCT_GLYPHS, string> = {
  INTL: "/products/intl.webp",
  SIF: "/products/sif.webp",
  MF: "/products/mf.webp",
  PMS: "/products/pms.webp",
  AIF: "/products/aif.webp",
};
