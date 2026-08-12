"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RevealWords, FadeUp } from "@/components/ui/Reveal";
import { CROSSFADE, SPRING, SPRING_SNAP } from "@/lib/motion";
import { PRODUCT_GLYPHS } from "@/lib/productGlyphs";
import { PANEL_ARTWORK } from "@/lib/productArtwork";

type Product = {
  slug: string;
  name: string;
  tag: keyof typeof PRODUCT_GLYPHS;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    slug: "international",
    name: "International Investing",
    tag: "INTL",
    description:
      "Global diversification through exposure to international markets and economies.",
  },
  {
    slug: "sif",
    name: "Specialised Investment Funds",
    tag: "SIF",
    description: "SEBI-regulated funds with advanced portfolio strategies.",
  },
  {
    slug: "mutual-funds",
    name: "Mutual Funds",
    tag: "MF",
    description:
      "Professionally managed, diversified portfolios for long-term investing.",
  },
  {
    slug: "pms",
    name: "Portfolio Management Services",
    tag: "PMS",
    description:
      "Personalized portfolio management for high-net-worth individuals.",
  },
  {
    slug: "aif",
    name: "Alternative Investment Funds",
    tag: "AIF",
    description:
      "Alternative investment funds for non-traditional asset classes and strategies.",
  },
];

function ProductRow({
  product,
  active,
  onActivate,
  onDeactivate,
}: {
  product: Product;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={`/products/${product.slug}`}
      className="press press-row group relative block cursor-pointer overflow-hidden border-t border-mist"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      {/* Midnight sweep — grows from the bottom, and retreats the same way.
          The origin is fixed: flipping it between enter and exit meant an
          interrupted sweep snapped to the opposite edge mid-flight. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-midnight"
        initial={false}
        // One animate shape. Branching it on reduce changed the style Motion
        // writes into the SSR output, so attributes diverged on hydration.
        // Reduced motion snaps instead, through the transition below.
        animate={{ opacity: 1, scaleY: active ? 1 : 0 }}
        style={{ originY: 1 }}
        transition={reduce ? CROSSFADE : SPRING}
      />

      <div className="relative z-10 flex flex-col gap-3 px-1 py-8 md:py-10 lg:grid lg:grid-cols-[7rem_1fr_minmax(0,20rem)_3.5rem] lg:items-center lg:gap-8">
        {/* Tag only. The ordinal that used to lead this cell was literally the
            array index, so reordering the list silently renumbered everything
            — it asserted a sequence these five parallel categories do not
            have. Numbering stays exclusive to Journey, where the order is
            real. The tag survives any reordering because it is true. */}
        <span
          className={`text-sm tracking-[0.08em] transition-colors duration-hover ${
            active ? "text-brass" : "text-brass-deep"
          }`}
        >
          {product.tag}
        </span>

        {/* Name */}
        <span
          className={`font-display text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.05] tracking-tight transition-colors duration-hover ${
            active ? "text-violet-bright" : "text-ink"
          }`}
        >
          {product.name}
        </span>

        {/* Description */}
        <span
          className={`max-w-md text-sm leading-relaxed transition-colors duration-hover md:text-base ${
            active ? "text-lavender-dim" : "text-ink-muted"
          }`}
        >
          {product.description}
        </span>

        {/* Trailing arrow — slides in on hover/focus */}
        <span
          aria-hidden
          className={`hidden justify-self-end transition-all duration-hover ease-out lg:block ${
            active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          }`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="text-brass"
          >
            <path
              d="M5 14 H 22 M15 6.5 L 22.5 14 L 15 21.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function Products() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const activate = (i: number) => {
    setActiveIndex(i);
    setPreviewIndex(i);
  };

  const preview = PRODUCTS[previewIndex];

  return (
    <section
      id="products"
      className="bg-porcelain px-6 py-24 text-ink md:px-10 md:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Asymmetric heading — headline pushed right, note anchored bottom-left.
            Expressed in the shared 12-column, 32px system rather than a flex
            row with its own 64px gutter. */}
        <div className="mb-16 grid grid-cols-12 gap-x-4 gap-y-6 sm:gap-x-8 md:mb-20 lg:mb-24 lg:items-end">
          <RevealWords
            text="Five instruments. One discipline."
            as="h2"
            accent={["discipline."]}
            className="col-span-12 block max-w-[16ch] font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight lg:col-span-7 lg:col-start-6 lg:ml-auto lg:text-right"
          />
          <FadeUp
            delay={0.25}
            className="col-span-12 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-end lg:pb-2"
          >
            <p className="max-w-md text-base text-ink-muted md:text-lg">
              SEBI-regulated products, matched to your goals, horizon and
              appetite for risk.
            </p>
          </FadeUp>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
          {/* The index */}
          <div className="border-b border-mist lg:col-span-9">
            {PRODUCTS.map((product, i) => (
              <FadeUp key={product.tag} delay={0.08 + i * 0.07}>
                <ProductRow
                  product={product}
                  active={activeIndex === i}
                  onActivate={() => activate(i)}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </FadeUp>
            ))}
          </div>

          {/* Fixed preview panel — crossfades a glyph per product (lg+) */}
          <FadeUp
            delay={0.3}
            className="hidden lg:sticky lg:top-24 lg:col-span-3 lg:block"
          >
            {/* Solid, not glass: nothing sits behind this panel worth showing
                through. It earns depth from elevation instead — a light
                shadow, because the ground here is plain rather than busy. */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-midnight shadow-[0_18px_50px_-24px_oklch(0.22_0.045_288/0.45)]">
              {/* Not mode="wait": making the incoming panel queue behind the
                  outgoing one adds latency to every hover. Both are absolutely
                  positioned, so they cross-fade concurrently instead. */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={preview.tag}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={reduce ? CROSSFADE : SPRING_SNAP}
                >
                  {/* Full-bleed rather than inset: the art carries its own
                      midnight ground, so floating it inside the panel would
                      show a seam wherever the two darks disagree. Decorative —
                      the product name below names it, and the row itself is
                      the link. The tag that used to sit at the top-left is
                      gone: the artwork is that tag, set large. */}
                  <Image
                    src={PANEL_ARTWORK[preview.tag]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 326px, 0px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-8 left-8 right-8 font-display track-caption text-lg text-lavender">
                    {preview.name}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
