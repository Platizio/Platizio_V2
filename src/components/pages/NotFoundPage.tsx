"use client";

import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import ContactCTA from "@/components/site/ContactCTA";
import { FadeUp } from "@/components/ui/Reveal";

/**
 * The onward routes a reader who mistyped a URL is most likely to have wanted.
 *
 * Every entry is a real, prerendered route — not a guess at what they meant.
 * `/products` and `/insights` lead the list because they are the two index
 * pages whose children carry slugs, and a mistyped slug is by far the most
 * likely way to land here: `/products/mutualfunds` and
 * `/insights/why-sif-2026` both 404, and both are one click from the right
 * page once the index is in front of the reader.
 */
const ONWARD = [
  {
    href: "/products",
    label: "Products",
    description:
      "Mutual funds, PMS, AIF, SIF and international investing — what each one is, and who it suits.",
  },
  {
    href: "/insights",
    label: "Media Insights",
    description:
      "Articles and market analysis across every product we distribute.",
  },
  {
    href: "/about",
    label: "About",
    description: "The firm, its registration, and the people behind it.",
  },
  {
    href: "/",
    label: "Home",
    description: "Back to the start.",
  },
] as const;

/**
 * The 404 page's body.
 *
 * Split out as a client component for the same reason every other interior
 * page is: `SiteShell`, `PageHero` and `ContactCTA` are all `"use client"`
 * (they run Lenis, Motion and the entrance choreography), while the route file
 * that renders them stays a server component. `app/not-found.tsx` therefore
 * mirrors `app/about/page.tsx` — a thin server file over a client page — and
 * the 404 gets the site's real chrome: nav, footer, skip link and all.
 *
 * What a reader got before this existed was the framework default: a bare
 * "404 / This page could not be found." on a white ground, with no nav, no
 * footer and no links at all — a dead end on a site whose entire purpose is to
 * route people to a consultation. Measured against the running build, that
 * page contained exactly zero anchors.
 */
export default function NotFoundPage() {
  return (
    <SiteShell>
      {/* No `<title>` or `<meta>` in this tree. React 19 would hoist them into
          <head>, but they land after the ones the root layout's metadata
          emits, and the browser takes the first — so they would be dead
          markup. This page names itself from the `metadata` export in
          `app/not-found.tsx`, which the app loader collects exactly as it does
          a `page.tsx`. See the note there. */}
      <PageHero
        label="404"
        headline="That page isn't on the map."
        accent={["map."]}
        intro="The link may be out of date, or the address may have a typo in it. Everything the site does have is one click away below."
        compact
      />

      <section className="bg-porcelain px-6 py-20 text-ink md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          {/*
            An h2, and a visible one. The hero's h1 says what happened; this
            says what to do next, and a reader navigating by heading needs a
            level between the h1 and the h3s below or every onward link hangs
            off nothing. `InsightsIndex` hides its equivalent because its hero
            already names the list; here the two headings say different things.
          */}
          <h2 className="font-display text-2xl tracking-tight text-ink md:text-3xl">
            Where you might have been going
          </h2>

          <ul className="mt-10 flex flex-col divide-y divide-mist border-t border-mist">
            {ONWARD.map((item, i) => (
              <li key={item.href}>
                <FadeUp delay={i * 0.06}>
                  <Link
                    href={item.href}
                    className="group flex items-baseline justify-between gap-6 py-6 transition-colors duration-hover hover:text-brass-deep md:py-7"
                  >
                    <span className="flex flex-col gap-1.5">
                      <span className="font-display text-xl tracking-tight md:text-2xl">
                        {item.label}
                      </span>
                      <span className="max-w-[58ch] text-sm leading-relaxed text-ink-muted">
                        {item.description}
                      </span>
                    </span>
                    {/* aria-hidden: the arrow is decoration, and without this
                        a screen reader announces the link as "Products →". */}
                    <span
                      aria-hidden
                      className="shrink-0 text-brass-deep transition-transform duration-hover group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/*
        The site's one closing act, with copy written for this page rather than
        the default "Begin with a conversation." — a reader who has just hit a
        dead end is being offered a person, not a funnel.
      */}
      <ContactCTA
        heading="Or just ask us directly."
        accent={["directly."]}
        body="If you were looking for something specific and cannot find it, tell us what it was and we will point you at it."
        buttonLabel="Get in touch"
        href="/contact"
      />
    </SiteShell>
  );
}
