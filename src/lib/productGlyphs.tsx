import type { ReactNode } from "react";

/**
 * Stroke-based instrument glyphs — one per product. Drawn inside a
 * `viewBox="0 0 120 120"`. Shared by the homepage Products index and the
 * per-product detail pages so both stay in visual lockstep.
 */
export const PRODUCT_GLYPHS: Record<string, ReactNode> = {
  /* Layered strata — stacked strategy layers */
  SIF: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 38 C 42 29, 78 47, 106 36" />
      <path d="M14 60 C 42 51, 78 69, 106 58" opacity="0.7" />
      <path d="M14 82 C 42 73, 78 91, 106 80" opacity="0.45" />
      <circle cx="106" cy="36" r="2.5" fill="currentColor" stroke="none" />
    </g>
  ),
  /* Ascending sparkline — disciplined compounding */
  MF: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 94 L 36 74 L 52 82 L 74 50 L 90 58 L 106 30" />
      <circle cx="106" cy="30" r="3" fill="currentColor" stroke="none" />
      <path d="M14 104 H 106" opacity="0.3" />
    </g>
  ),
  /* One bold, singular path — a bespoke mandate */
  PMS: (
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <path
        d="M18 96 C 52 96, 40 26, 72 24 C 94 23, 102 46, 104 66"
        strokeWidth="3.5"
      />
      <circle cx="18" cy="96" r="2.5" fill="currentColor" stroke="none" />
    </g>
  ),
  /* Branching paths — non-traditional routes */
  AIF: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M60 104 L 60 66" />
      <path d="M60 66 C 60 48, 44 46, 38 28" />
      <path d="M60 66 C 60 48, 76 46, 82 28" />
      <path d="M60 88 C 58 76, 46 78, 40 66" opacity="0.55" />
      <circle cx="38" cy="28" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="82" cy="28" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="40" cy="66" r="2" fill="currentColor" stroke="none" opacity="0.55" />
    </g>
  ),
  /* Globe meridians — markets beyond the border */
  INTL: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="60" cy="60" r="44" />
      <path d="M60 16 C 38 34, 38 86, 60 104" opacity="0.7" />
      <path d="M60 16 C 82 34, 82 86, 60 104" opacity="0.7" />
      <path d="M18 54 C 40 46, 80 46, 102 54" opacity="0.45" />
      <path d="M18 70 C 40 78, 80 78, 102 70" opacity="0.45" />
    </g>
  ),
};
