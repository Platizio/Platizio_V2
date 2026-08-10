"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { IntroProvider, useIntroDone } from "@/components/IntroProvider";
import Nav from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import Footer from "@/components/sections/Footer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FadeUp, RevealWords } from "@/components/ui/Reveal";
import { SPRING_ENTER } from "@/lib/motion";

const STARS = [
  [7, 23, 2],
  [15, 13, 3],
  [22, 35, 1.5],
  [33, 19, 2],
  [41, 40, 1.5],
  [53, 9, 2.5],
  [65, 29, 1.5],
  [73, 16, 2],
  [84, 35, 2.5],
  [92, 12, 1.5],
] as const;

const PRINCIPLES = [
  {
    number: "01",
    title: "Our mission",
    body: "To help investors make informed, risk-aware investment decisions through transparent, research-driven solutions across modern and traditional asset classes.",
  },
  {
    number: "02",
    title: "Our vision",
    body: "To be a trusted investment platform enabling investors to build resilient, future-ready portfolios across market cycles.",
  },
  {
    number: "03",
    title: "Our values",
    body: "Integrity, clarity, and trust guide every interaction. We focus on suitability, transparency, and long-term outcomes while maintaining disciplined risk management.",
  },
] as const;

const TEAM = [
  {
    name: "Deepika Agarwal",
    role: "Financial Market Analyst",
    image: "/about/deepika-agarwal.png",
  },
  {
    name: "Anuj Pal",
    role: "Senior Financial Market Analyst",
    image: "/about/anuj-pal.jpeg",
  },
  {
    name: "Aanyaa Bhardwaj",
    role: "Social Media Executive",
    image: "/about/aanyaa-bhardwaj.jpg",
  },
  {
    name: "Kartik Vishnani",
    role: "Financial Market Analyst",
    image: "/about/kartik-vishnani.jpg",
  },
  {
    name: "Kavya Khatri",
    role: "Social Media Executive",
    image: "/about/kavya-khatri.png",
  },
  {
    name: "Sumit Katyal",
    role: "Product Software Developer",
    image: "/about/sumit-katyal.jpg",
  },
  {
    name: "Vinayak Tyagi",
    role: "Product Software Developer",
    image: "/about/vinayak-tyagi.jpeg",
  },
] as const;

function CompassSeal({ variant }: { variant: "amfi" | "sebi" }) {
  const ticks = Array.from({ length: variant === "amfi" ? 24 : 8 }, (_, i) => {
    const count = variant === "amfi" ? 24 : 8;
    const angle = (i / count) * Math.PI * 2;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const inner = variant === "amfi" ? 23.5 : 17;
    return (
      <line
        key={i}
        x1={(32 + inner * c).toFixed(2)}
        y1={(32 + inner * s).toFixed(2)}
        x2={(32 + 28.5 * c).toFixed(2)}
        y2={(32 + 28.5 * s).toFixed(2)}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 64 64"
      className="h-16 w-16 text-brass"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" />
      <circle cx="32" cy="32" r={variant === "amfi" ? "21" : "24"} strokeDasharray={variant === "amfi" ? undefined : "2 3"} />
      {ticks}
      {variant === "amfi" ? (
        <>
          <path d="M32 12v40M12 32h40" opacity="0.55" />
          <circle cx="32" cy="32" r="8" />
          <circle cx="32" cy="32" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <path d="M32 15 37 27 49 32 37 37 32 49 27 37 15 32 27 27Z" />
          <circle cx="32" cy="32" r="3" />
        </>
      )}
    </svg>
  );
}

function AboutHero() {
  const ready = useIntroDone();
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { ...SPRING_ENTER, delay },
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] overflow-hidden bg-midnight px-6 pb-16 pt-32 text-lavender md:px-10 md:pb-20 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-y-0 left-[19%] w-px bg-lavender/10" />
        <div className="absolute inset-y-0 left-[58%] w-px bg-lavender/10" />
        <div className="absolute inset-x-0 top-[61%] h-px bg-lavender/10" />
        {STARS.map(([x, y, size], i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-brass"
            style={{ left: `${x}%`, top: `${y}%`, width: size * 2, height: size * 2 }}
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3], scale: [1, 1.45, 1] }}
            transition={{ duration: 3.5 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        ))}
        <svg viewBox="0 0 1000 560" className="absolute -bottom-16 right-[-12rem] h-[34rem] w-[62rem] text-violet-bright/25" fill="none">
          <path d="M0 460C157 338 241 471 372 332S629 367 717 206 891 148 1000 60" stroke="currentColor" strokeWidth="1" />
          <path d="M0 498C186 377 260 509 404 372S650 412 753 258 901 192 1000 122" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-end">
        <motion.p {...rise(0.18)} className="text-sm text-brass">
          About Platizio
        </motion.p>
        <h1 className="mt-8 max-w-[11ch] font-display text-[clamp(3.4rem,8vw,6.75rem)] font-medium leading-[0.98] tracking-tight text-porcelain">
          <motion.span {...rise(0.3)} className="block">
            Your trusted
          </motion.span>
          <motion.span {...rise(0.42)} className="block">
            partner in building
          </motion.span>
          <motion.span {...rise(0.54)} className="block italic text-brass">
            resilient portfolios.
          </motion.span>
        </h1>

        <div className="mt-12 grid gap-10 border-t border-lavender/15 pt-7 md:mt-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <motion.p {...rise(0.72)} className="max-w-[52ch] text-base leading-relaxed text-lavender-dim md:text-lg">
            A regulated, research-driven platform built to help investors make
            considered decisions across changing market cycles.
          </motion.p>
          <motion.div {...rise(0.82)} className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
            <span className="flex items-center gap-2 text-lavender">
              <span className="size-1.5 rotate-45 bg-brass" /> AMFI Registered
            </span>
            <span className="flex items-center gap-2 text-lavender">
              <span className="size-1.5 rotate-45 bg-brass" /> SEBI Compliant
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AboutContent() {
  return (
    <>
      <Nav />
      <main>
        <AboutHero />

        <section className="bg-porcelain px-6 py-28 text-ink md:px-10 md:py-40 lg:px-16">
          <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end">
            <div>
              <p className="text-sm text-brass-deep">What is Platizio?</p>
              <RevealWords
                as="h2"
                text="Institutional thinking, made personal."
                accent={["personal."]}
                className="mt-6 max-w-[15ch] font-display text-[clamp(2.7rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-tight"
              />
            </div>
            <FadeUp delay={0.16}>
              <p className="border-t border-mist pt-6 text-base leading-relaxed text-ink-muted md:text-lg">
                Platizio is a licensed and certified distributor of Mutual Funds
                and Specialised Investment Funds (SIFs), helping investors
                access advanced strategies through a transparent, regulated
                framework. We combine research-backed insights with personalized
                guidance to make institutional-grade investing accessible to
                every investor.
              </p>
              <p className="mt-6 font-display text-xl leading-snug text-ink">
                Platizio Services LLP
                <span className="block font-sans text-sm text-ink-muted">
                  Financial Products Distribution Platform
                </span>
              </p>
            </FadeUp>
          </div>
        </section>

        <section id="principles" className="bg-porcelain px-6 pb-28 text-ink md:px-10 md:pb-40 lg:px-16">
          <div className="mx-auto max-w-[1400px] border-t border-mist pt-8 md:pt-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
              <FadeUp>
                <p className="max-w-[18ch] font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.06] tracking-tight">
                  The principles behind every decision.
                </p>
              </FadeUp>
              <div className="divide-y divide-mist border-b border-mist">
                {PRINCIPLES.map((principle, i) => (
                  <FadeUp key={principle.number} delay={i * 0.1} className="grid gap-5 py-8 md:grid-cols-[4.5rem_1fr] md:py-10">
                    <span className="font-display text-2xl text-brass-deep">{principle.number}</span>
                    <div>
                      <h3 className="font-display text-2xl tracking-tight md:text-3xl">{principle.title}</h3>
                      <p className="mt-4 max-w-[54ch] leading-relaxed text-ink-muted">{principle.body}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-midnight px-6 py-24 text-lavender md:px-10 md:py-36 lg:px-16">
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[minmax(0,0.83fr)_minmax(0,1.17fr)] lg:items-center lg:gap-24">
            <FadeUp className="relative aspect-[4/5] overflow-hidden bg-midnight-2 sm:aspect-[16/10] lg:aspect-[4/5]">
              <Image
                src="/about/founder.jpg"
                alt="Platizio Founder and CEO"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.16_0.045_288/0.85),transparent_55%)]" />
              <span className="absolute bottom-6 left-6 font-display text-xl text-porcelain">Founder &amp; CEO</span>
              <span className="absolute right-6 top-6 flex size-11 items-center justify-center rounded-full border border-brass/60 text-brass">P</span>
            </FadeUp>

            <div>
              <p className="text-sm text-brass">Leadership</p>
              <RevealWords
                as="h2"
                text="Experience that keeps the work grounded."
                accent={["grounded."]}
                className="mt-6 max-w-[13ch] font-display text-[clamp(2.7rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-tight text-porcelain"
              />
              <FadeUp delay={0.16} className="mt-9 border-t border-lavender/15 pt-7">
                <p className="font-display text-xl leading-snug text-lavender md:text-2xl">Certified Financial Planner (CFP®)</p>
                <ul className="mt-7 space-y-4 text-base leading-relaxed text-lavender-dim">
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rotate-45 bg-brass" />Over 30 years of experience across financial services and international business.</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rotate-45 bg-brass" />Deep understanding of Indian and Global financial markets across equities, bonds, and commodities.</li>
                  <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rotate-45 bg-brass" />Active interest in equity derivatives and algorithmic trading.</li>
                </ul>
              </FadeUp>
            </div>
          </div>
        </section>

        <section className="bg-porcelain px-6 py-24 text-ink md:px-10 md:py-36 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-8 border-b border-mist pb-12 md:pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-end">
              <RevealWords
                as="h2"
                text="The people behind Platizio."
                accent={["Platizio."]}
                className="max-w-[14ch] font-display text-[clamp(2.7rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-tight"
              />
              <FadeUp delay={0.18}>
                <p className="max-w-[45ch] text-base leading-relaxed text-ink-muted md:text-lg">
                  The research, advisory, and operations team building resilient,
                  future-ready portfolios.
                </p>
              </FadeUp>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:mt-14 md:gap-x-7 md:gap-y-14 lg:grid-cols-4">
              {TEAM.map((member, i) => (
                <FadeUp key={member.name} delay={(i % 4) * 0.07}>
                  <article className="group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-mist">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 48vw"
                        className="object-cover transition duration-drift [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity duration-ui group-hover:opacity-100" />
                    </div>
                    <h3 className="mt-4 font-display text-xl tracking-tight md:text-2xl">{member.name}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{member.role}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-midnight px-6 py-24 text-lavender md:px-10 md:py-36 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
              <RevealWords
                as="h2"
                text="Trust is a practice, not a promise."
                accent={["practice,"]}
                className="max-w-[14ch] font-display text-[clamp(2.7rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-tight text-porcelain"
              />
              <FadeUp delay={0.18}>
                <p className="max-w-[50ch] text-base leading-relaxed text-lavender-dim md:text-lg">
                  We operate under strict regulatory frameworks to support transparency and investor protection across our offerings.
                </p>
              </FadeUp>
            </div>

            <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 lg:gap-8">
              <FadeUp>
                <article className="group h-full border border-lavender/15 bg-midnight-2 p-8 transition-colors duration-ui hover:border-brass/50 md:p-10">
                  <CompassSeal variant="amfi" />
                  <h3 className="mt-10 font-display text-3xl tracking-tight text-porcelain">AMFI Registration</h3>
                  <p className="mt-5 max-w-[48ch] leading-relaxed text-lavender-dim">
                    Platizio Services LLP is registered with the Association of
                    Mutual Funds in India (AMFI), ensuring adherence to the
                    highest standards of ethical mutual fund distribution.
                  </p>
                </article>
              </FadeUp>
              <FadeUp delay={0.14} className="md:mt-16">
                <article className="group h-full border border-lavender/15 bg-midnight-2 p-8 transition-colors duration-ui hover:border-brass/50 md:p-10">
                  <CompassSeal variant="sebi" />
                  <h3 className="mt-10 font-display text-3xl tracking-tight text-porcelain">SEBI Compliance</h3>
                  <p className="mt-5 max-w-[48ch] leading-relaxed text-lavender-dim">
                    We operate under the regulatory framework of the Securities
                    and Exchange Board of India (SEBI), maintaining full
                    transparency and investor protection across all offerings,
                    including Specialised Investment Funds.
                  </p>
                </article>
              </FadeUp>
            </div>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden bg-violet px-6 py-28 text-porcelain md:px-10 md:py-40 lg:px-16">
          <div className="pointer-events-none absolute -right-24 -top-28 size-[32rem] rounded-full border border-porcelain/15" aria-hidden />
          <div className="pointer-events-none absolute -right-8 -top-12 size-[22rem] rounded-full border border-porcelain/15" aria-hidden />
          <div className="relative mx-auto flex max-w-[1400px] flex-col items-start">
            <RevealWords
              as="h2"
              text="Begin with a conversation."
              accent={["conversation."]}
              className="max-w-[14ch] font-display text-[clamp(2.8rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-tight"
            />
            <FadeUp delay={0.2} className="mt-7">
              <p className="max-w-[48ch] text-lg leading-relaxed text-porcelain/75">
                Connect with us to discover the right investment strategy for your financial goals.
              </p>
            </FadeUp>
            <FadeUp delay={0.35} className="mt-9">
              <MagneticButton href="/contact" variant="brass" className="px-9 py-4 text-base">
                Book a consultation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function AboutPage() {
  return (
    <IntroProvider>
      <SmoothScroll>
        <AboutContent />
      </SmoothScroll>
    </IntroProvider>
  );
}
