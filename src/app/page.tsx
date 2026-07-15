import { IntroProvider } from "@/components/IntroProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import Manifesto from "@/components/sections/Manifesto";
import Products from "@/components/sections/Products";
import Journey from "@/components/sections/Journey";
import Trust from "@/components/sections/Trust";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <IntroProvider>
      <SmoothScroll>
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <Manifesto />
          <Products />
          <Journey />
          <Trust />
          <Testimonials />
          <CTA />
          <Footer />
        </main>
      </SmoothScroll>
    </IntroProvider>
  );
}
