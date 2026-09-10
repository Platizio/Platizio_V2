"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { FadeUp } from "@/components/ui/Reveal";
import {
  EMAIL,
  GRIEVANCE_OFFICER,
  OFFICES,
  PHONE_DISPLAY,
  PHONE_TEL,
  SIF_INSIGHTS,
  SUPPORT_EMAIL,
  SUPPORT_GLOBAL_EMAIL,
  WHATSAPP_NUMBER,
} from "@/lib/site";

const PRODUCTS = [
  "International Investing",
  "Specialised Investment Funds (SIF)",
  "Mutual Funds",
  "Portfolio Management Services (PMS)",
  "Alternative Investment Funds (AIF)",
  "Not sure / Need guidance",
];

/**
 * Phone validation, deliberately permissive.
 *
 * `type="tel"` performs no validation of its own — the type only hints the
 * keypad — so before this the field accepted "abcdef" as a phone number
 * (audit finding L-01). The lookahead is the whole test: at least seven digits
 * must appear somewhere. Everything after it just says which non-digits may
 * separate them — "+", spaces, dots, dashes, brackets, and the comma or slash
 * people use when they give two numbers in one field.
 *
 * The ceiling is 48, not 32. At 32 this rule contradicted itself: it advertised
 * the comma and slash for a second number, then ran out of room before two
 * formatted Indian numbers fit ("+91 98765 43210, +91 98765 43211" is 33), so
 * the documented case was rejected with nothing but the browser's generic
 * "Please match the requested format". 48 fits it with room for spacing.
 *
 * Seven, not ten. An Indian mobile is ten digits and that is what nearly every
 * submission will be, but the field must also take a landline with an STD code
 * and any international number, and the shortest of those run to seven
 * subscriber digits. The upper bound of 32 characters covers E.164's 15 digits
 * with generous room for separators and a second number.
 *
 * The bias throughout is towards accepting: this is the top of a lead-capture
 * funnel, where wrongly rejecting a real number loses the enquiry outright,
 * while a loose match at worst lets through a number that a human then has to
 * read. The rule only has to be strong enough that prose cannot pass as a
 * phone number, and it is.
 *
 * Note there is no trailing anchor on a digit: browsers do not trim the value
 * of a `tel` input, so requiring one would reject a pasted number carrying a
 * trailing space. The lookahead already guarantees the digits are there.
 */
const PHONE_PATTERN = String.raw`(?=(?:\D*\d){7,})\+?[\d\s.,\/\(\)\-]{7,48}`;

/**
 * Cap on the message, in characters.
 *
 * Neither destination takes an arbitrarily long enquiry. `mailto:` is the
 * binding constraint at roughly 2,000 characters for the whole URL; wa.me
 * tolerates about 4,096. Past those the enquiry is silently truncated, or the
 * link simply fails to open — and the reader has no way to know either
 * happened, because this form has no backend to fall back to (audit finding
 * L-02).
 *
 * The arithmetic, measured against the mailto: URL this page actually builds:
 * with a 60-character name, a 60-character email, a 20-character phone number
 * and the longest product label, the subject and the preamble encode to 461
 * characters before the message starts. That leaves ~1,540 of the 2,000.
 * encodeURIComponent expands ordinary English prose by about 1.5x once its
 * spaces, newlines, commas and colons become %20/%0A/%2C/%3A, so 800
 * characters of message encode to roughly 1,210 and land the whole URL near
 * 1,670 — about 330 characters of headroom for a rupee sign, an em dash or a
 * name that is not Latin, each of which costs 9 characters encoded.
 *
 * 800 characters is around 130 words, which is more than enough to open a
 * conversation; the detail belongs in the consultation, not the form.
 */
const MESSAGE_MAX = 800;

function buildEnquiry(data: FormData) {
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const product = String(data.get("product") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  const lines = [
    "Hi Platizio, I'd like to book a consultation.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
  ];
  if (product) lines.push(`Product of interest: ${product}`);
  if (message) lines.push(`Message: ${message}`);
  return { name, text: lines.join("\n") };
}

/** Small labelled field wrapper. */
function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="flex items-baseline justify-between text-sm text-ink">
        {label}
        {optional && <span className="text-xs text-ink-muted">Optional</span>}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

/**
 * `border-field`, not `border-mist`. A field's underline is its only affordance
 * — there is no box, no fill — and mist on porcelain measures 1.06:1, so the
 * inputs were effectively invisible to anyone not looking straight at them.
 * `field` is the lightest token that clears the 3:1 WCAG 1.4.11 asks of a
 * control's boundary. `outline-none` only suppresses the browser default; the
 * unlayered `:focus-visible` rule in globals.css is not in a cascade layer and
 * still wins, so the focus ring is unaffected.
 */
const INPUT =
  "w-full border-b border-field bg-transparent py-3 text-ink outline-none transition-colors duration-hover placeholder:text-ink-muted/70 focus:border-brass-deep";

export default function ContactPage() {
  const [opened, setOpened] = useState<null | "whatsapp" | "email">(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const { text } = buildEnquiry(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpened("whatsapp");
  }

  function emailInstead(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.closest("form");
    if (!form) return;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const { name, text } = buildEnquiry(data);
    const subject = `Consultation request${name ? ` — ${name}` : ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(text)}`;
    setOpened("email");
  }

  return (
    <SiteShell>
      <PageHero
        label="Book a consultation"
        headline="Let's find the right strategy."
        accent={["strategy."]}
        intro="Tell us about your investment goals and we'll help you find the strategy that fits."
        chips={["AMFI Registered", "SEBI Compliant"]}
      />

      <section className="bg-porcelain px-6 py-20 text-ink md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-24">
          {/* Form */}
          <FadeUp>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-medium tracking-tight text-ink">
              Get in touch
            </h2>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-ink-muted">
              Complete the form and we&rsquo;ll open a prefilled message so you
              can reach our team on WhatsApp or by email.
            </p>

            {/*
              `method="dialog"` on a form that is not inside a <dialog> is the
              standards-defined way to say "this form has no native submission":
              the HTML spec aborts the submit step outright. It matters because
              of what the notice below promises. `onSubmit` prevents the default
              only once React has hydrated — before that, or with scripting off,
              a form with no action natively GETs every field to the current
              URL, so the reader's name, email and phone number would land in a
              query string on Platizio's own origin, in server and CDN logs, on
              the one page that tells them nothing is sent to this website.
              This makes the markup keep the promise the copy makes.
            */}
            <form
              method="dialog"
              onSubmit={onSubmit}
              className="mt-10 flex flex-col gap-7"
            >
              <Field label="Full name" htmlFor="name">
                <input id="name" name="name" type="text" required placeholder="Enter your full name" className={INPUT} />
              </Field>
              <Field label="Email address" htmlFor="email">
                <input id="email" name="email" type="email" required placeholder="Enter your email address" className={INPUT} />
              </Field>
              <Field label="Phone number" htmlFor="phone">
                {/* `title` is not decoration here: when a `pattern` fails,
                    browsers append it to the otherwise contentless "Please
                    match the requested format." bubble, so it is the only
                    place the reader is told what went wrong. */}
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  pattern={PHONE_PATTERN}
                  title="Enter a phone number — digits only, optionally with +, spaces, dashes or brackets."
                  placeholder="Enter your phone number"
                  className={INPUT}
                />
              </Field>
              <Field label="Product of interest" htmlFor="product" optional>
                <select id="product" name="product" defaultValue="" className={`${INPUT} cursor-pointer`}>
                  <option value="" disabled>
                    Select a product
                  </option>
                  {PRODUCTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              {/* The hint sits outside <Field>, not inside it, and the pair is
                  wrapped so the form's `gap-7` still spaces them as one field.
                  Field renders a <label> around its children, and any text
                  inside a label is folded into the accessible name of the
                  control it labels — putting the hint there would rename the
                  textarea to "Message Optional Up to 800 characters…".
                  `aria-describedby` reaches it by id from out here anyway, and
                  a description is the right relationship: it is announced
                  after the name, on focus, rather than becoming the name. */}
              <div>
                <Field label="Message" htmlFor="message" optional>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={MESSAGE_MAX}
                    aria-describedby="message-limit"
                    placeholder="Tell us about your investment goals..."
                    className={`${INPUT} resize-none`}
                  />
                </Field>
                {/* Stated, not left to be discovered: maxLength enforces itself
                    silently — the textarea just stops accepting keystrokes,
                    with no message and no visible reason — so a reader part-way
                    through a long enquiry would find it cut off mid-sentence
                    and not know why. */}
                <p id="message-limit" className="mt-2 text-xs text-ink-muted">
                  Up to {MESSAGE_MAX} characters — the enquiry travels inside a
                  WhatsApp or email link, which has a length limit.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-midnight px-8 py-3.5 font-medium text-porcelain transition-colors duration-hover hover:bg-violet"
                >
                  Submit via WhatsApp
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M2 8h11M9 3.5 13.5 8 9 12.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={emailInstead}
                  /* `-my-3 py-3`: this is the form's only non-WhatsApp submit
                     path, and it sat at 86x20 beside a 251x52 button in the
                     same flex row — it reads as that button's peer but was a
                     fifth of its height to hit. The negative margin cancels the
                     padding, so the row's gap-y-4 spacing is unchanged. */
                  className="-my-3 cursor-pointer py-3 text-sm text-brass-deep underline-offset-4 hover:underline"
                >
                  Email instead
                </button>
              </div>

              {/* Two elements, deliberately. These used to be one: the consent
                  notice was the fallback branch of the same ternary that
                  rendered the status, so submitting replaced the disclosure
                  with "Opening WhatsApp…" — the notice disappeared at the exact
                  moment it became the record of what the reader agreed to. The
                  status is the only part that is live; the notice is permanent. */}
              <p className="text-xs leading-relaxed text-ink-muted">
                This form does not send anything to Platizio directly. Submitting
                opens WhatsApp (operated by Meta) or your own email app with your
                name, email, phone number, the product you selected and your
                message already written into the message, for you to send.
                Nothing is stored on this website. By sending it you agree to be
                contacted about your enquiry — see our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-brass-deep underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              <p
                className="text-xs leading-relaxed text-brass-deep"
                aria-live="polite"
                role="status"
              >
                {/* Both branches hedge rather than assert, and that is not
                    vagueness — the outcome is genuinely undetectable. Opening
                    with `noopener` makes `window.open` return null on SUCCESS,
                    so a return-value check would paint a failure on every
                    working handoff, and a `mailto:` navigation reports nothing
                    either way. With no signal to branch on, the honest thing is
                    to name both outcomes and say what to do about the bad one.

                    The recovery each one names is the form itself. `onSubmit`
                    calls `preventDefault` and nothing resets the fields, so
                    after a blocked popup the whole enquiry — including a
                    message up to MESSAGE_MAX — is still sitting directly above
                    this line, and pressing the button again re-fires the
                    identical URL from a fresh user gesture, which is exactly
                    what a popup blocker allows through. Pointing at the
                    "Reach us directly" links alone, as this used to, sent a
                    reader to a channel where they would retype it all. */}
                {opened === "whatsapp"
                  ? "Opening WhatsApp with your enquiry — send the message to reach our team. If nothing opened, your browser may have blocked the popup: your details are still in the form above, so press Submit again, or use the WhatsApp link under “Reach us directly”."
                  : opened === "email"
                    ? "Opening your email app with your enquiry prefilled. If nothing opened, you may have no mail app set up: your details are still in the form above, and the address is under “Reach us directly”."
                    : ""}
              </p>
            </form>
          </FadeUp>

          {/* Contact details */}
          <FadeUp delay={0.15}>
            <div className="border-t border-mist pt-8">
              <h2 className="font-display text-2xl tracking-tight text-ink">Reach us directly</h2>

              <div className="mt-8 flex flex-col divide-y divide-mist">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Hi, I am interested in learning about Platizio investment services.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5 transition-colors hover:text-brass-deep"
                >
                  <span>
                    <span className="block text-sm text-ink-muted">WhatsApp</span>
                    <span className="mt-1 block font-display text-lg text-ink group-hover:text-brass-deep">
                      Message us on WhatsApp
                      {/* WCAG 3.2.5 / technique G201: both links on this page that
                          leave the site in a new tab now announce it, the way the
                          footer's YouTube links already did. Without the warning,
                          Back looks broken to a screen-reader or low-vision user
                          who has no way to notice the tab changed. */}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </span>
                  <span aria-hidden className="text-brass-deep transition-transform group-hover:translate-x-1">→</span>
                </a>

                <a href={`mailto:${EMAIL}`} className="group flex items-center justify-between py-5 transition-colors hover:text-brass-deep">
                  <span>
                    <span className="block text-sm text-ink-muted">Email</span>
                    <span className="mt-1 block font-display text-lg text-ink group-hover:text-brass-deep">{EMAIL}</span>
                  </span>
                  <span aria-hidden className="text-brass-deep transition-transform group-hover:translate-x-1">→</span>
                </a>

                <a href={`tel:${PHONE_TEL}`} className="group flex items-center justify-between py-5 transition-colors hover:text-brass-deep">
                  <span>
                    <span className="block text-sm text-ink-muted">Phone</span>
                    <span className="mt-1 block font-display text-lg text-ink group-hover:text-brass-deep">{PHONE_DISPLAY}</span>
                  </span>
                  <span aria-hidden className="text-brass-deep transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>

              {/*
                Support and grievance channels, surfaced on the page.

                All three of these addresses existed only inside the legal
                documents — a reader had to open a policy and find the right
                clause to learn that support@ and grievances@ were even the
                right places to write. For the grievance officer that is a
                compliance problem, not just a usability one: the DPDP Act
                requires the grievance mechanism to be readily available, and
                clause 19 of a privacy policy is not readily available.

                Strings come from lib/site.ts, so this block and the four legal
                documents quote the same addresses and the same officer.
              */}
              <div className="mt-10 border-t border-mist pt-8">
                <h3 className="font-display text-lg tracking-tight text-ink">
                  Support and grievances
                </h3>
                <dl className="mt-4 flex flex-col gap-3 text-sm">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <dt className="text-ink-muted">General support</dt>
                    <dd>
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brass-deep underline underline-offset-4">
                        {SUPPORT_EMAIL}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <dt className="text-ink-muted">International investing</dt>
                    <dd>
                      <a href={`mailto:${SUPPORT_GLOBAL_EMAIL}`} className="text-brass-deep underline underline-offset-4">
                        {SUPPORT_GLOBAL_EMAIL}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-ink-muted">
                      Grievance officer — {GRIEVANCE_OFFICER.name},{" "}
                      {GRIEVANCE_OFFICER.designation}
                    </dt>
                    <dd className="flex flex-wrap items-baseline gap-x-3">
                      <a href={`mailto:${GRIEVANCE_OFFICER.email}`} className="text-brass-deep underline underline-offset-4">
                        {GRIEVANCE_OFFICER.email}
                      </a>
                      <a href={`tel:${GRIEVANCE_OFFICER.phoneTel}`} className="text-brass-deep underline underline-offset-4">
                        {GRIEVANCE_OFFICER.phoneDisplay}
                      </a>
                    </dd>
                    <dd className="text-ink-muted">{GRIEVANCE_OFFICER.hours}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {OFFICES.map((office) => (
                  <div key={office.city}>
                    <p className="text-sm text-brass-deep">{office.city} office</p>
                    <address className="mt-3 text-sm not-italic leading-relaxed text-ink-muted">
                      {office.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </div>
                ))}
              </div>

              <a
                href={SIF_INSIGHTS.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-brass-deep"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
                </svg>
                {SIF_INSIGHTS.name} on YouTube — {SIF_INSIGHTS.handle}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </SiteShell>
  );
}
