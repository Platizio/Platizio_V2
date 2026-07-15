"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { FadeUp } from "@/components/ui/Reveal";

const WHATSAPP_NUMBER = "919205523100";
const EMAIL = "vc@platizio.com";
const PHONE_DISPLAY = "+91 92055 23100";
const PHONE_TEL = "+919205523100";
const YT = "https://www.youtube.com/@sifinsights";

const PRODUCTS = [
  "Specialised Investment Funds (SIF)",
  "Mutual Funds",
  "Portfolio Management Services (PMS)",
  "Alternative Investment Funds (AIF)",
  "International Investing",
  "Not sure / Need guidance",
];

const OFFICES = [
  {
    city: "Noida",
    lines: ["Unit No. 415, Tower-B, KLJ Noida One,", "Plot #B-8, Sector-62, Noida, UP 201309, India"],
  },
  {
    city: "Delhi",
    lines: ["Unit DGL-229, Second Floor, DLF Galleria Mall,", "Mayur Vihar-1, Delhi, India – 110092"],
  },
];

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

const INPUT =
  "w-full border-b border-mist bg-transparent py-3 text-ink outline-none transition-colors duration-300 placeholder:text-ink-muted/70 focus:border-brass-deep";

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
        label="Book a Consultation"
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
              Complete the form and we'll open a prefilled message so you can
              reach our team on WhatsApp or by email.
            </p>

            <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-7">
              <Field label="Full name" htmlFor="name">
                <input id="name" name="name" type="text" required placeholder="Enter your full name" className={INPUT} />
              </Field>
              <Field label="Email address" htmlFor="email">
                <input id="email" name="email" type="email" required placeholder="Enter your email address" className={INPUT} />
              </Field>
              <Field label="Phone number" htmlFor="phone">
                <input id="phone" name="phone" type="tel" required placeholder="Enter your phone number" className={INPUT} />
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
              <Field label="Message" htmlFor="message" optional>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your investment goals..."
                  className={`${INPUT} resize-none`}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-midnight px-8 py-3.5 font-medium text-porcelain transition-colors duration-300 hover:bg-violet"
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
                  className="cursor-pointer text-sm text-brass-deep underline-offset-4 hover:underline"
                >
                  Email instead
                </button>
              </div>

              <p className="text-xs leading-relaxed text-ink-muted" aria-live="polite">
                {opened === "whatsapp"
                  ? "Opening WhatsApp with your enquiry — send the message to reach our team."
                  : opened === "email"
                    ? "Opening your email app with your enquiry prefilled."
                    : "By submitting, you agree to be contacted by our team regarding your investment inquiry."}
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
                href={YT}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-brass-deep"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
                </svg>
                SIF Insights on YouTube — @sifinsights
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </SiteShell>
  );
}
