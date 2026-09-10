import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Content Security Policy.
 *
 * The docs' recommended policy is nonce-based, issued from `proxy.ts`. That is
 * not available here: a fresh nonce per request requires dynamic rendering, and
 * every one of this site's 22 pages is prerendered at build time and served
 * from cache. Adopting nonces would trade the entire static build — and its
 * 2ms TTFB — for a directive whose value depends on an injection sink this site
 * does not have.
 *
 * So `'unsafe-inline'` stays on scripts and styles, and it is load-bearing in
 * both cases: Next.js emits inline bootstrap scripts (`self.__next_f.push`)
 * into every prerendered document, and Motion animates by writing inline
 * `style` attributes, so a policy without it would leave the site unanimated.
 * What makes that acceptable is the surrounding surface, which was checked
 * rather than assumed: no third-party scripts, no iframes, no `fetch`, no
 * user-generated content, and no backend to inject anything from. There is
 * exactly one `dangerouslySetInnerHTML` in `src/` — the JSON-LD block in
 * `app/layout.tsx`, whose payload is `JSON.stringify` of build-time constants
 * with `<` escaped, so it carries no runtime input and cannot close its own
 * script tag. If a second one ever appears, this paragraph is the thing to
 * re-check before trusting the policy above.
 *
 * The directives that carry real weight here are the ones below `style-src`.
 * `frame-ancestors 'none'` is the one that matters most: it stops a regulated
 * financial brand being framed wholesale on a look-alike domain, and unlike the
 * script directives nothing about this site's rendering weakens it.
 *
 * If the site ever gains a dynamic route, revisit this: at that point the
 * proxy.ts nonce approach in the Next.js CSP guide becomes affordable.
 */
/**
 * `next dev` needs one directive production does not. React reconstructs
 * server-side error stacks in the browser using `eval`, so with a CSP that
 * omits `'unsafe-eval'` the error overlay and owner stacks are blocked on every
 * page of the dev server — the Next.js CSP guide calls this out explicitly.
 * Neither React nor Next uses `eval` in a production build, so the directive is
 * added only here and never ships.
 */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // The contact form navigates to wa.me and mailto: via window.open rather
  // than submitting, so no external form target is needed.
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // frame-ancestors already covers this for modern browsers; kept for older
  // ones that honour the header but not the directive.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin cross-site, nothing on downgrade. The enquiry flow hands
  // off to WhatsApp with the reader's details in the URL, so a full-path
  // referrer is exactly what should not leave this site.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these; deny them rather than leave them open.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Two years, preloadable. Only meaningful over HTTPS — browsers ignore it on
  // plain HTTP, so it is inert in local development.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /**
   * One extra srcset candidate, because the default array has a hole exactly
   * where this site's densest image grid sits.
   *
   * The team portraits on /about render in a `grid-cols-2 gap-x-4` inside a
   * `px-6` section, so each cell is `(100vw - 4rem) / 2` — 174 CSS px on a
   * 412px phone, which at that device's 2.625 DPR needs 457 device pixels.
   * Next's default `imageSizes` is [32, 48, 64, 96, 128, 256, 384] and
   * `deviceSizes` starts at 640, so the srcset jumps straight from 384 to 640
   * with nothing in between: every portrait was fetched at 640w to fill a slot
   * needing 457. Adding 512 gives the browser the candidate it actually wants.
   *
   * The array REPLACES the default rather than extending it, so the seven
   * default entries are restated. 512 stays below the smallest `deviceSizes`
   * entry (640), which is the constraint the image docs put on `imageSizes`.
   *
   * This only pays off together with the corrected `sizes` on that grid in
   * `components/pages/AboutPage.tsx` — measured A/B on the live page, each fix
   * alone still picks 640, and only both together drop to 512. Together they
   * take the six team photos from 106,896 to 72,394 delivered bytes (-32%).
   *
   * `deviceSizes` is deliberately untouched: the default covers every
   * full-bleed slot here. `formats` too — the default `['image/webp']` beat
   * AVIF on these exact images when measured (127,601 B AVIF q60 vs
   * 106,896 B WebP q75 for the same six), so enabling AVIF would cost bytes.
   * `qualities` is not set either: no call site passes a `quality` prop, so
   * every request is q=75, and Next 16's default allowlist is already [75].
   */
  images: {
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 512],
  },

  // Pin the workspace root so Turbopack doesn't select an unrelated lockfile
  // (a stray package-lock.json in the home directory) as the root.
  turbopack: {
    root: projectRoot,
  },

  // Don't advertise the framework and version to a scanner.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  /**
   * `/favicon.ico` used to be a real file — the create-next-app scaffold icon,
   * unmodified since the first commit. It is gone, replaced by the generated
   * `app/icon.tsx`, and every browser follows the `<link rel="icon">` that
   * emits rather than probing the root path.
   *
   * Crawlers, feed readers and link-preview bots do still probe `/favicon.ico`
   * blindly, though, and a 404 there is a worse answer than a redirect. This
   * keeps that path answering without putting the icon back on disk in two
   * formats that could disagree.
   *
   * Permanent: the location is not going to move again, and a 308 lets a
   * client cache it rather than re-asking on every crawl.
   */
  async redirects() {
    return [{ source: "/favicon.ico", destination: "/icon", permanent: true }];
  },
};

export default nextConfig;
