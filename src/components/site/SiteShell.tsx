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
      <Nav />
      <main id="top">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
