import { SITE_NAME } from "@/lib/site";

/**
 * The app mark, shared by the two generated icon routes so they cannot drift.
 *
 * There was no Platizio mark on this site at all. `src/app/favicon.ico` was
 * the create-next-app scaffold icon — a black disc with the white Vercel
 * triangle — carried unmodified since the repository's first commit
 * (`git log --follow` on it returns exactly one entry, "Initial commit from
 * Create Next App"). An AMFI-registered financial brand was shipping the
 * framework's placeholder logo in every browser tab, every bookmark and every
 * search-result favicon slot.
 *
 * Drawn rather than vendored, for the reason `app/opengraph-image.tsx` gives
 * about the share card: it removes the need for a design asset in the repo,
 * and a generated image that touches no request-time API is built once at
 * build time and cached, so the site stays fully prerendered.
 *
 * The initial rather than the wordmark. `public/platizio-logo.png` is the
 * brand's actual mark, but it is a 500×150 raster wordmark — letterboxed into
 * a square it is illegible at 32px, and there is no vector source in the repo
 * to set it from. The initial in the site's own midnight-and-brass carries the
 * brand at icon size the way the share card does: through palette and
 * proportion rather than through type.
 */

/**
 * sRGB literals for `--color-midnight` and `--color-brass`.
 *
 * Restated here for the same reason `app/opengraph-image.tsx` restates its
 * palette: this renders through Satori, outside a browser, where the oklch
 * custom properties in `globals.css` do not exist.
 */
export const MARK_MIDNIGHT = "#0d091f";
export const MARK_BRASS = "#e4b750";

/**
 * @param px The square's edge in pixels — used to scale the glyph, since
 *   Satori resolves no relative font sizes against the viewport.
 *
 * Opaque and unrounded on purpose: iOS composites a home-screen tile onto
 * black and applies its own squircle mask, so a transparent or pre-rounded
 * tile gets clipped twice.
 *
 * No `letterSpacing`: on a single centred glyph it only adds trailing advance
 * and pushes the mark off centre. Satori supports flexbox only — no grid, no
 * float — and every container with more than one child needs an explicit
 * `display: flex`; this one has a single child and is explicit anyway.
 */
export function Mark({ px }: { px: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: MARK_MIDNIGHT,
        color: MARK_BRASS,
        fontSize: Math.round(px * 0.64),
      }}
    >
      {SITE_NAME.charAt(0)}
    </div>
  );
}
