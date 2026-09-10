import { ImageResponse } from "next/og";
import { Mark } from "@/lib/mark";

/**
 * The browser-tab icon.
 *
 * This is what replaces `src/app/favicon.ico`, which was the create-next-app
 * scaffold mark — see the header on `lib/mark.tsx`. The `.ico` is deleted
 * rather than left in place because `resolve-metadata` unshifts a favicon to
 * the FRONT of the resolved icon list: leaving it would have kept the
 * scaffold triangle winning the tab even with this route in place.
 *
 * `/favicon.ico` still answers for anything that probes the root path blindly
 * — a redirect in `next.config.ts` sends it here.
 *
 * 32×32: the size browsers actually render in a tab on a 2x display, and the
 * one Next advertises for a generated `icon`. A generated icon cannot be an
 * `.ico` — app-icons.md: "You cannot generate a favicon icon. Use icon or a
 * favicon.ico file instead."
 */

/*
 * File-convention icons reach a route only while no segment declares
 * `metadata.icons` — `resolve-metadata` applies the collected static icons
 * under `if (!resolvedMetadata.icons)`. A route that later writes
 * `icons: { ... }` in its own metadata silently drops BOTH this icon and the
 * apple tile on that route. It is the icon-shaped twin of the shallow
 * `openGraph` merge that `OG_DEFAULTS` exists for; `tests/seo.spec.ts` pins
 * both icons across every route so a regression is caught rather than noticed.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<Mark px={size.width} />, { ...size });
}
