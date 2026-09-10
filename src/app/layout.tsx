import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import {
  AMFI_ARN,
  EMAIL,
  LEGAL_NAME,
  OFFICES,
  OG_DEFAULTS,
  PHONE_TEL,
  REGISTERED_OFFICE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  YOUTUBE_CHANNELS,
} from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  /**
   * Without this, any metadata field given a relative URL is a build error —
   * that is the whole reason the site had no Open Graph image slot and no
   * canonical anywhere (audit finding M-03). Declared here in the root layout
   * so every route below inherits it, and every route's relative `/og.png` or
   * `alternates.canonical: "/about"` resolves against the real origin instead
   * of failing. `SITE_URL` is not yet confirmed against a live deployment —
   * see the note on it in `lib/site.ts`.
   */
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  /**
   * The compliance-reviewed wording, and the reasoning behind every clause of
   * it, now lives on `SITE_DESCRIPTION` in `lib/site.ts`. The string is
   * unchanged; it moved so that the search snippet, `og:description` and
   * `twitter:description` all quote the one sentence that was reviewed rather
   * than three separately-drifting copies of it. Read that comment before
   * touching this — the wording is an AMFI constraint, not a style choice.
   */
  description: SITE_DESCRIPTION,

  /**
   * Nested metadata objects merge *shallowly* between segments: a route that
   * exports its own `openGraph` replaces this entire object rather than adding
   * to it. So these defaults reach a child route in exactly one of two ways —
   * the route sets no `openGraph` at all and inherits all of it, or it spreads
   * `OG_DEFAULTS` and re-states `title`, `description` and `url` itself. A
   * route that writes a bare `openGraph: { title }` gets no `og:site_name`,
   * no `og:locale` and no `og:type`.
   *
   * The same rule is why there is no `alternates.canonical` here: inherited
   * shallowly, a root canonical of "/" would have all 19 routes declare the
   * homepage as their canonical URL and ask Google to drop 18 of them.
   */
  openGraph: {
    ...OG_DEFAULTS,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },

  /**
   * No `images` yet, here or on `openGraph`: `public/` holds no share image,
   * and the 500×150 logo is below the 300×157 minimum X renders a card from,
   * so pointing at it would produce a broken card rather than no card. Until
   * a 1200×630 asset exists this degrades to a plain summary card, which is
   * the intended fallback — `summary_large_image` is declared now so adding
   * that file is the only remaining step, and `metadataBase` above already
   * lets it be referenced as a relative path.
   */
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

/**
 * Organization structured data (audit finding M-04). Without it a search
 * engine has to infer the firm's identity from prose; with it the legal
 * entity, its registration, its offices and its channels are stated once,
 * unambiguously, from the same constants the pages render.
 *
 * Typed as `FinancialService` rather than plain `Organization`: it is a
 * subtype of Organization (via LocalBusiness), so every Organization-level
 * signal — `name`, `url`, `logo`, `sameAs` — still applies, while naming what
 * the entity actually is. `logo` finally gives `public/platizio-logo.png` a
 * consumer; it had been shipping unreferenced (finding L-11).
 *
 * `address` is the registered office named in the Terms, singular, because
 * that is the address *of the entity*; both working offices appear under
 * `location`. A consumer that reads only one address then gets the legal one.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  // A stable node id, so a page-level graph can later point at this entity
  // (`publisher`, `provider`) instead of restating it.
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/platizio-logo.png`,
  email: EMAIL,
  telephone: PHONE_TEL,
  address: {
    "@type": "PostalAddress",
    ...REGISTERED_OFFICE.postalAddress,
  },
  location: OFFICES.map((office) => ({
    "@type": "Place",
    name: `${office.city} office`,
    address: {
      "@type": "PostalAddress",
      ...office.postalAddress,
    },
  })),
  sameAs: YOUTUBE_CHANNELS.map((channel) => channel.href),
  identifier: {
    "@type": "PropertyValue",
    name: "AMFI Registration Number (ARN)",
    value: AMFI_ARN,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} antialiased`}
    >
      <body>
        {/*
          The one `dangerouslySetInnerHTML` in `src/`, and the documented way
          to emit JSON-LD — `next/script` is for executable code, this is data.
          The payload is a real object run through `JSON.stringify`, never an
          interpolated template string, so it cannot be emitted malformed; the
          `<` escape is the sanitising step the Next.js JSON-LD guide asks for,
          preventing any constant that ever grows a `</script>` from closing
          this tag early. It renders nothing, so it is inert with respect to
          the preloader and the entrance choreography below it.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
