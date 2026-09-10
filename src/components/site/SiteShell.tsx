"use client";

import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import Footer from "@/components/sections/Footer";

/**
 * Shared chrome for interior pages: Lenis smooth scroll + fixed Nav + Footer.
 * Unlike the homepage, interior pages skip the drenched preloader so
 * navigation stays instant. Entrance-gated components (Nav) read the default
 * `useIntroDone()` value of `true` and animate in immediately.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      {/* WCAG 2.4.1 Bypass Blocks: the first focusable node in the document,
          ahead of the fixed nav it exists to get past. A plain <a>, not
          next/link — the target is a fragment of the page already on screen,
          so there is no route to push. Lenis picks the click up (it is
          constructed with `anchors: true`) and animates the scroll without
          calling preventDefault, so the browser's own fragment handling still
          runs and focus lands on <main> below. */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav />
      {/* `main-content`, not the `top` this used to carry. Nothing ever linked
          to #top — it is an anchor id the hero sections own (links.spec.ts
          pins the homepage's by selecting `section#top`), and the homepage's
          <main> therefore cannot use it, because Hero already does. Rather
          than have the skip link resolve to a different id per route, both
          shells now name their <main> the same thing.

          tabIndex={-1} because a fragment target that cannot hold focus is a
          skip link that only scrolls: the browser's sequential-focus starting
          point is not honoured consistently across browsers and screen
          readers, and where it is not, focus stays on the link and the next
          Tab walks straight back into the nav. */}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}
