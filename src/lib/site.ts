import type { Metadata } from "next";

/**
 * Site-wide constants: the identity, contact and registration facts that more
 * than one file needs to agree on.
 *
 * This exists because they had started to diverge. The WhatsApp number, the
 * enquiry email, the phone number and the two office addresses were declared
 * privately at the top of `components/pages/ContactPage.tsx`, and the
 * @sifinsights YouTube URL was written out a second time in
 * `components/sections/Footer.tsx` (audit finding L-13) — two literals for one
 * channel, with nothing keeping them equal. A regulated firm's ARN, registered
 * office and contact channels are exactly the facts that must not drift
 * between the page a reader lands on and the structured data a search engine
 * reads, so they are declared once, here, and imported everywhere else.
 */

/**
 * The production origin, CONFIRMED 2026-09-10 against the live DNS:
 * `platizio.com` answers 301 to `https://www.platizio.com/`, and `www` serves
 * 200 with no further redirect. `www` is canonical, so the `www.` prefix here
 * is correct and dropping it would canonicalise every page to a host that only
 * redirects.
 *
 * Also confirmed that this repository is a rebuild of what already lives there
 * rather than a new site at a new address: /about, /insights, /products/sif,
 * /privacy-policy and /global-investing/privacy-policy all answer 200 on the
 * existing site at the same paths this one generates.
 */
const PRODUCTION_ORIGIN = "https://www.platizio.com";

/**
 * The origin THIS build should call its own.
 *
 * Not simply `PRODUCTION_ORIGIN`, because for now those are different things.
 * The V2 site currently deploys to `platizio-v2.vercel.app` while
 * `www.platizio.com` still serves the legacy site — and a build that hardcodes
 * the production origin tells Google that every page of a publicly crawlable
 * deployment is canonically a page on a host serving different markup, and
 * publishes a sitemap of 19 URLs it does not itself own. `/products` 404s on
 * the legacy site today, so that sitemap advertises at least one URL that is
 * broken at the address it names.
 *
 * The resolution order below makes the build describe wherever it actually is:
 *
 *   1. `NEXT_PUBLIC_SITE_URL` — the explicit answer. Set this in Vercel's
 *      production environment when the custom domain is attached, and it wins
 *      over everything else.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` on a production deployment — the
 *      project's own production domain, whatever it currently is. This flips
 *      to `www.platizio.com` on its own once that domain is attached.
 *   3. `VERCEL_URL` — any other deployment describes itself, so a preview
 *      self-canonicalises instead of pointing at production.
 *   4. The production origin, for local builds and `npm run build` off-platform.
 *
 * These are read at build time, which is the only time that matters here: all
 * 25 routes are prerendered, so no request-time API is involved and the site
 * stays fully static.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // Vercel supplies these hostnames without a protocol.
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (process.env.VERCEL_ENV === "production" && productionHost) {
    return `https://${productionHost}`;
  }

  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost) return `https://${deploymentHost}`;

  return PRODUCTION_ORIGIN;
}

/**
 * The canonical origin. Everything that must be an absolute URL — the
 * `metadataBase` in `app/layout.tsx`, the sitemap entries, the `url` and
 * `logo` in the Organization JSON-LD — is built from this one value.
 */
export const SITE_URL = resolveSiteUrl();

/**
 * Whether this build is the real, public site — and so whether it should be in
 * the search index at all.
 *
 * Deliberately NOT `VERCEL_ENV === "production"`. That is true of the current
 * deployment, which lives on `platizio-v2.vercel.app`: it is the production
 * deployment *of the project*, while the production *site* is still the legacy
 * one on `www.platizio.com`. Testing the environment would have called the
 * duplicate the real thing and left it advertising itself to crawlers, which is
 * the exact situation this is meant to end.
 *
 * Comparing the resolved origin to the brand domain asks the question that
 * actually matters — "is this build the site people are meant to find?" — and
 * answers itself the moment the domain is attached or `NEXT_PUBLIC_SITE_URL`
 * is set, with no second switch to remember to flip.
 *
 * A local build resolves to `PRODUCTION_ORIGIN` and so counts as production,
 * which is right: nothing on a developer's machine is publicly crawlable, and
 * the alternative would be a build whose robots output nobody can test.
 */
export const IS_PRODUCTION_DEPLOYMENT = SITE_URL === PRODUCTION_ORIGIN;

/** Short brand name, used as `og:site_name` and in page titles. */
export const SITE_NAME = "Platizio";

/** The full legal entity, for the JSON-LD `legalName` and the footer notice. */
export const LEGAL_NAME = "Platizio Services LLP";

/** The homepage's document title, and the default `og:title`. */
export const SITE_TITLE = "Platizio — Navigate Every Market With Confidence";

/**
 * The site's default meta description, and the default `og:description`.
 *
 * No return claim here. This replaces "focuses on superior returns and
 * capital preservation", which implied an outcome an AMFI-registered
 * distributor may not promise — the same rule that removed the hero's
 * invented "+24.8%". It survived that pass because it lives in metadata
 * rather than on the page, and it is what search results quote.
 *
 * "SEBI compliant" is gone from THIS SENTENCE for a second reason: it described
 * the firm, and Platizio is an AMFI-registered distributor, not a SEBI-
 * registered intermediary. Trust.tsx already words this correctly — the
 * products are SEBI-regulated — and this now matches it. 155 characters, inside
 * the ~160 search results show.
 *
 * That fix is local to this string. The site still describes the FIRM as SEBI-
 * compliant in several places — the "SEBI Compliant" chips on the about,
 * contact and products heroes, and a stronger claim in the About page's
 * compliance card. Those are audit finding L-16 and are deliberately left
 * alone: rewording a regulated firm's own description of its registrations is
 * a decision for whoever signs off on the ARN, not a refactor. Do not read this
 * comment as saying the site is consistent yet.
 *
 * It moved out of `app/layout.tsx` unchanged, character for character, so the
 * Open Graph and Twitter descriptions quote the same compliance-reviewed
 * sentence the search snippet does rather than a second, unreviewed one. Any
 * rewrite here is a compliance change: it must not reacquire a return claim
 * ("superior returns", "guaranteed", "assured", "high returns") and must not
 * describe the firm itself as SEBI-registered.
 */
export const SITE_DESCRIPTION =
  "A disciplined, risk-aware approach to investing across SEBI-regulated products — mutual funds, PMS, AIF, SIF and international investing. AMFI ARN 341407.";

/** AMFI mutual fund distributor registration number, without the "ARN" prefix. */
export const AMFI_ARN = "341407";

/* ---------------------------------------------------------------------- *
 * Contact
 * ---------------------------------------------------------------------- */

/** Digits only, no "+" — this is interpolated into a `https://wa.me/<n>` URL. */
export const WHATSAPP_NUMBER = "919205523100";

/** Enquiry address. The legal documents use support@/grievances@ separately. */
export const EMAIL = "vc@platizio.com";

/** Human-readable phone number, spaced for reading. */
export const PHONE_DISPLAY = "+91 92055 23100";

/** The same number in E.164, for `tel:` links and schema.org `telephone`. */
export const PHONE_TEL = "+919205523100";

/**
 * The statutory and support addresses.
 *
 * All three were reachable only by reading a legal document — none appeared on
 * any page, and the contact page offered `vc@platizio.com` alone. That is a
 * problem for `GRIEVANCE_EMAIL` in particular: the DPDP Act requires the
 * grievance channel to be readily available, and burying it in clause 19 of a
 * policy is the opposite of that. They live here so the contact page and the
 * legal documents quote the same strings.
 */
export const SUPPORT_EMAIL = "support@platizio.com";
export const SUPPORT_GLOBAL_EMAIL = "supportglobal@platizio.com";
export const GRIEVANCE_EMAIL = "grievances@platizio.com";

/**
 * The named grievance officer, required under the DPDP Act 2023 and the IT Act
 * rules, and the reason this is a constant rather than four hand-typed copies:
 * the four legal documents disagreed about the designation. Two said
 * "Operations and Compliance Officer", two said "Operations and Compliance
 * Head", for one statutory role held by one person — and the global documents
 * carried a contact number the domestic ones omitted entirely.
 *
 * DESIGNATION NOT CONFIRMED. "Officer" is used here because it is the wording
 * of the domestic privacy policy, which is the document the DPDP grievance
 * mechanism actually runs through. If "Head" is the correct designation, change
 * it here and all four documents follow. Note this is his statutory role; the
 * about page lists his functional one ("Senior Financial Market Analyst"),
 * which is a different thing and not necessarily a contradiction.
 */
export const GRIEVANCE_OFFICER = {
  name: "Anuj Pal",
  designation: "Operations and Compliance Officer",
  email: GRIEVANCE_EMAIL,
  phoneDisplay: "+91 92898 37100",
  phoneTel: "+919289837100",
  hours: "Monday to Friday, 9:00 AM to 5:00 PM India Standard Time",
} as const;

export type Office = {
  city: string;
  /**
   * Address as printed on the contact page, verbatim, one array entry per
   * rendered line. Kept as authored rather than derived from the structured
   * form below: the line breaks are a typographic decision, not data.
   */
  lines: string[];
  /**
   * The same address decomposed for structured data. The field names are
   * schema.org `PostalAddress` property names deliberately, so the JSON-LD in
   * `app/layout.tsx` can spread this object straight into a PostalAddress node
   * with no translation layer to keep in sync. `addressRegion` spells out the
   * state that the display lines abbreviate ("UP").
   */
  postalAddress: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2. */
    addressCountry: string;
  };
  /**
   * The registered office named in the Terms & Conditions. Exactly one office
   * carries this, and it is the address structured data should report as *the*
   * address of the entity — the other is a working office.
   */
  registered?: boolean;
};

export const OFFICES: Office[] = [
  {
    city: "Noida",
    lines: ["Unit No. 415, Tower-B, KLJ Noida One,", "Plot #B-8, Sector-62, Noida, UP 201309, India"],
    postalAddress: {
      streetAddress: "Unit No. 415, Tower-B, KLJ Noida One, Plot #B-8, Sector-62",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201309",
      addressCountry: "IN",
    },
  },
  {
    city: "Delhi",
    lines: ["Unit DGL-229, Second Floor, DLF Galleria Mall,", "Mayur Vihar-1, Delhi, India – 110092"],
    postalAddress: {
      streetAddress: "Unit DGL-229, Second Floor, DLF Galleria Mall, Mayur Vihar-1",
      addressLocality: "Delhi",
      addressRegion: "Delhi",
      postalCode: "110092",
      addressCountry: "IN",
    },
    registered: true,
  },
];

/** The registered office, resolved by flag rather than by array index so that
 *  reordering or adding an office cannot silently change which address the
 *  structured data reports as the entity's own. */
export const REGISTERED_OFFICE: Office =
  OFFICES.find((o) => o.registered) ?? OFFICES[0];

/* ---------------------------------------------------------------------- *
 * YouTube
 * ---------------------------------------------------------------------- */

export type YouTubeChannel = {
  name: string;
  handle: string;
  href: string;
};

/**
 * Named separately from the array because two places link this one channel on
 * its own — the contact page's single YouTube row, and the Organization
 * `sameAs` list — and finding [0] would break the moment the order changes.
 * This is the single declaration the L-13 duplicate URL collapses into.
 */
const SIF_INSIGHTS_CHANNEL: YouTubeChannel = {
  name: "SIF Insights",
  handle: "@sifinsights",
  href: "https://www.youtube.com/@sifinsights",
};

/** All three channels, in the order the footer lists them. */
export const YOUTUBE_CHANNELS: YouTubeChannel[] = [
  SIF_INSIGHTS_CHANNEL,
  {
    name: "Platizio Alternatives",
    handle: "@PlatizioAlternatives",
    href: "https://www.youtube.com/@PlatizioAlternatives",
  },
  {
    name: "Platizio Global",
    handle: "@PlatizioGlobal",
    href: "https://www.youtube.com/@PlatizioGlobal",
  },
];

export const SIF_INSIGHTS = SIF_INSIGHTS_CHANNEL;

/* ---------------------------------------------------------------------- *
 * Open Graph
 * ---------------------------------------------------------------------- */

/**
 * The Open Graph fields that are true of every page, pulled out as a shared
 * object because Next.js metadata merging makes them easy to lose.
 *
 * Metadata objects from nested segments are merged *shallowly*: a route that
 * exports its own `openGraph` replaces the root layout's entire `openGraph`
 * object rather than merging into it. So a page that sets only
 * `openGraph: { title }` silently drops `og:site_name`, `og:locale` and
 * `og:type`. The Next.js metadata guide names this and prescribes exactly this
 * fix — hoist the shared nested fields into a variable and spread them.
 *
 * A route that overrides Open Graph should therefore write:
 *
 *     openGraph: { ...OG_DEFAULTS, title, description, url: "/about" }
 *
 * `url` is deliberately not in here: it is per-route, and a shared default
 * would have every page claim the homepage as its Open Graph URL.
 */
export const OG_DEFAULTS = {
  siteName: SITE_NAME,
  /**
   * en_IN, not en_US. The audience is Indian, the products are SEBI-regulated
   * Indian instruments, and the amounts are quoted in rupees. The `<html lang>`
   * stays "en" because the copy is not regionally spelled.
   */
  locale: "en_IN",
  type: "website",
  /**
   * The share card has to be restated here, and that is not redundancy.
   *
   * `app/opengraph-image.tsx` injects itself into the ROOT segment's
   * `openGraph`. But nested metadata merges shallowly — the same rule that put
   * `siteName` and `locale` in this object — so the moment a route exports its
   * own `openGraph`, it replaces the root's entirely and the generated card
   * goes with it. That is not hypothetical: adding the image fixed `og:image`
   * on `/` and left all 18 other routes without one, because every one of them
   * overrides `openGraph` to set its own title and URL.
   *
   * Referenced without the content hash Next appends (`?68cab2ae…`). The route
   * serves the same 1200×630 PNG either way — verified — and the hash only
   * busts caches. Hardcoding it here would mean this line silently pointing at
   * a stale build every time the card is edited, which is a worse failure than
   * a scraper re-fetching an unchanged image.
   *
   * Resolved against `metadataBase` in the root layout, so the relative path
   * becomes absolute in the emitted tag.
   */
  images: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} — regulated investment distribution in India`,
    },
  ],
} satisfies Metadata["openGraph"];
