import { IntroProvider } from "@/components/IntroProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Products from "@/components/sections/Products";
import Journey from "@/components/sections/Journey";
import Trust from "@/components/sections/Trust";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <IntroProvider>
      <SmoothScroll>
        <Nav />
        <main>
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
          <CTA />
          <Footer />
        </main>
      </SmoothScroll>
    </IntroProvider>
  );
}
