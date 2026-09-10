import { ImageResponse } from "next/og";
import { Mark } from "@/lib/mark";

/**
 * The iOS home-screen tile.
 *
 * With no `apple-touch-icon` declared, Safari's "Add to Home Screen" saves a
 * downscaled screenshot of whatever was on screen. Measured on this site that
 * is the midnight hero, so the saved tile was a near-black square with an
 * illegible sliver of the fixed nav — indistinguishable from any other dark
 * site on the home screen. `favicon.ico` does not cover this: iOS ignores
 * `rel=icon` for home-screen tiles, and the two root paths it probes when the
 * link is absent (`/apple-touch-icon.png` and `-precomposed`) both 404 here.
 * Android Chrome's "Add to Home screen" reads the same link.
 *
 * 180×180 is the largest tile iOS asks for; every smaller one is downscaled
 * from it, so one size is enough.
 *
 * Only `size` and `contentType` are exported — app-icons.md lists no `alt`
 * for the icon conventions, unlike `opengraph-image`.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<Mark px={size.width} />, { ...size });
}
