import Link from "next/link";

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Media Insights", href: "/insights" },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms & Condition", href: "/terms-and-condition" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  {
    label: "Privacy Policy – Global Investing",
    href: "/global-investing/privacy-policy",
  },
  {
    label: "Terms & Condition – Global Investing",
    href: "/global-investing/terms-and-condition",
  },
];

const PRODUCT_LINKS = [
  { label: "Specialised Investment Funds", href: "/products/sif" },
  { label: "Mutual Funds", href: "/products/mutual-funds" },
  { label: "Portfolio Management Services", href: "/products/pms" },
  { label: "Alternative Investment Funds", href: "/products/aif" },
  { label: "International Investing", href: "/products/international" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-midnight text-lavender">
      <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-20 md:px-10 md:pt-28 lg:px-16">
        <div className="grid gap-14 border-b border-lavender/10 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <span className="font-display text-3xl tracking-tight text-porcelain">
              Platizio
            </span>
            <p className="max-w-[36ch] text-[0.95rem] leading-relaxed text-lavender-dim">
              Navigate every market with confidence — regulated, transparent,
              disciplined.
            </p>
            <a
              href="https://www.youtube.com/@sifinsights"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex w-fit items-center gap-2 text-sm text-lavender-dim transition-colors duration-300 hover:text-brass"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect
                  x="2.5"
                  y="5.5"
                  width="19"
                  height="13"
                  rx="3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
              </svg>
              YouTube — @sifinsights
            </a>
          </div>

          <nav aria-label="Quick links" className="flex flex-col gap-3">
            <span className="mb-1 font-display text-lg text-porcelain">
              Quick links
            </span>
            {QUICK_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="w-fit text-[0.92rem] text-lavender-dim transition-colors duration-300 hover:text-porcelain"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Products" className="flex flex-col gap-3">
            <span className="mb-1 font-display text-lg text-porcelain">
              Products
            </span>
            {PRODUCT_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="w-fit text-[0.92rem] text-lavender-dim transition-colors duration-300 hover:text-porcelain"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 py-8 text-[0.85rem] leading-relaxed text-lavender-dim md:flex-row md:items-start md:justify-between">
          <p className="max-w-[58ch]">
            Mutual Fund investments are subject to market risks. Please read
            all scheme related documents carefully before investing.
          </p>
          <div className="flex flex-col gap-1 md:items-end">
            <span className="text-brass">AMFI Registered · SEBI Compliant</span>
            <span>© 2026 Platizio Services LLP. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* watermark */}
      <div
        aria-hidden
        className="pointer-events-none select-none px-4 text-center font-display text-[clamp(5rem,18vw,17rem)] leading-[0.78] tracking-tight text-lavender/[0.045]"
      >
        Platizio
      </div>
    </footer>
  );
}
