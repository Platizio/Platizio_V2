import type { Metadata } from "next";
import { IntroProvider } from "@/components/IntroProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Products from "@/components/sections/Products";
import Journey from "@/components/sections/Journey";
import Trust from "@/components/sections/Trust";
import ContactCTA from "@/components/site/ContactCTA";
import Footer from "@/components/sections/Footer";

/**
 * Title, description and Open Graph come from the root layout — the homepage
 * is the one route those defaults already describe, so restating them here
 * would be two literals of one sentence.
 *
 * The canonical cannot come from there. Metadata merges shallowly, so a root
 * `alternates` would have all 19 routes name the homepage as their canonical
 * URL (the reasoning is on OG_DEFAULTS in lib/site.ts), which is why every
 * other route declares its own — and why, until this was added, the homepage
 * was the single route in the site shipping no canonical link at all.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <IntroProvider>
      <SmoothScroll>
        {/* WCAG 2.4.1 Bypass Blocks. This page assembles its own chrome rather
            than going through SiteShell, so the skip link has to be repeated
            here — as it does in every shell that hand-rolls Nav + main +
            Footer. It sits inside IntroProvider, after the preloader, which is
            fine: the curtain is aria-hidden and holds nothing focusable, so
            this is still the first tab stop in the document. See SiteShell.tsx
            for why it is a plain <a> rather than next/link. */}
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Nav />
        {/* `main-content`, matching SiteShell, and necessarily not `top`:
            Hero already uses id="top" inside this <main>, and two elements
            sharing an id would make the skip target resolve to whichever the
            browser found first. links.spec.ts pins the hero's id by selecting
            `section#top`, so that one stays where it is.

            tabIndex={-1} makes the target focusable so the link moves focus
            and not merely the scroll position — the reasoning is written out
            in SiteShell.tsx. */}
        <main id="main-content" tabIndex={-1}>
          <Hero />
          {/* Ticker removed, not deleted. A ticker promises live, changing
              information; this one carried the five product names plus two
              compliance badges — every item repeating verbatim in the section
              directly below and again in the footer. There is no market-data
              source in this project, and inventing figures is the mistake the
              hero's +24.8% already made. sections/Ticker.tsx is kept: restore
              it if a real feed with an as-of timestamp and attribution exists. */}
          <Manifesto />
          <Products />
          <Journey />
          <Trust />
          {/* Testimonials is unmounted, not deleted. Both quotes in
              sections/Testimonials.tsx are the site's own copy with the
              pronouns swapped — "explained clearly — why it fits my goals,
              what risks exist, and how it behaves in different market
              conditions" is Journey step 02 verbatim. An AMFI-registered
              distributor publishing in-house copy as third-party endorsement
              is a real exposure, so the section stays off the page until
              genuine, attributable quotes exist. Restore by re-adding
              <Testimonials /> once QUOTES holds real ones. */}
          {/* Every prop defaulted: the homepage is the canonical instance of
              the closing CTA, and interior pages override the copy. */}
          <ContactCTA />
          <Footer />
        </main>
      </SmoothScroll>
    </IntroProvider>
  );
}
