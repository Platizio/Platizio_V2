import { ImageResponse } from "next/og";
import { AMFI_ARN, SITE_NAME } from "@/lib/site";

/**
 * The share card, generated rather than designed (audit finding M-03).
 *
 * Every page on this site shared to WhatsApp — the channel this business
 * actually runs its enquiries through — rendered as a bare link, because no
 * route carried an `og:image` and `public/` held no share asset. The obvious
 * shortcut was to point at `platizio-logo.png`, but at 500×150 it sits under
 * the 300×157 minimum X renders a card from, so that would have produced a
 * *broken* card rather than no card.
 *
 * Generating it removes the need for a design asset at all. The Next.js docs
 * are explicit that generated images are statically optimised — built once and
 * cached — as long as they touch no request-time API, which this does not. So
 * the card costs one build-time render and nothing per request, and the site
 * stays fully prerendered.
 *
 * Placed at the root segment, so it cascades to all 19 routes. A route that
 * wants its own card only has to drop an `opengraph-image` file in its own
 * folder. `twitter:image` is deliberately not set separately: X falls back to
 * `og:image`, so a second copy would only be a second thing to keep in sync.
 *
 * Design note: this is drawn in the site's own palette — midnight ground,
 * porcelain type, a brass rule — but NOT in Fraunces. `ImageResponse` renders
 * through Satori, which needs font binaries passed to it explicitly, and this
 * project loads Fraunces through `next/font/google`, which deliberately does
 * not expose one. Rather than vendor a font file into the repo to gain an
 * italic serif at card size, the card carries the brand through colour,
 * proportion and the brass rule, and leaves type to the bundled default.
 *
 * Satori supports a subset of CSS: flexbox only (no grid, no float), and every
 * container holding more than one child needs an explicit `display: flex`.
 * That is why the markup below is more explicit than it would otherwise be.
 */

export const alt = `${SITE_NAME} — regulated investment distribution in India`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The palette, restated as literals: this renders outside the browser, so the
// oklch custom properties in globals.css are not available here. These are the
// sRGB equivalents of --color-midnight, --color-porcelain, --color-brass and
// --color-lavender-dim.
const MIDNIGHT = "#0d091f";
const PORCELAIN = "#f6f6fb";
const BRASS = "#e4b750";
const LAVENDER_DIM = "#9e9ebd";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: MIDNIGHT,
          padding: "72px 80px",
        }}
      >
        {/* Eyebrow — the registration, stated up front rather than buried. */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 44, height: 3, backgroundColor: BRASS, display: "flex" }} />
          <div
            style={{
              marginLeft: 20,
              color: BRASS,
              fontSize: 24,
              letterSpacing: 2,
              display: "flex",
            }}
          >
            AMFI REGISTERED · ARN {AMFI_ARN}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: PORCELAIN,
              fontSize: 104,
              lineHeight: 1.04,
              letterSpacing: -3,
              display: "flex",
            }}
          >
            Navigate every market
          </div>
          <div
            style={{
              color: BRASS,
              fontSize: 104,
              lineHeight: 1.04,
              letterSpacing: -3,
              display: "flex",
            }}
          >
            with confidence.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid ${LAVENDER_DIM}40`,
            paddingTop: 28,
          }}
        >
          <div style={{ color: PORCELAIN, fontSize: 40, letterSpacing: 1, display: "flex" }}>
            {SITE_NAME}
          </div>
          <div style={{ color: LAVENDER_DIM, fontSize: 26, display: "flex" }}>
            Mutual Funds · PMS · AIF · SIF · International
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
