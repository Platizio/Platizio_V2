"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RevealWords, FadeUp, EXPO } from "@/components/ui/Reveal";
import { PRODUCT_GLYPHS } from "@/lib/productGlyphs";

type Product = {
  slug: string;
  name: string;
  tag: keyof typeof PRODUCT_GLYPHS;
  description: string;
};

const PRODUCTS: Product[] = [
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
      "Professionally managed diversified portfolios for disciplined investing.",
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
  {
    slug: "international",
    name: "International Investing",
    tag: "INTL",
    description:
      "Global diversification through exposure to international markets and economies.",
  },
];

function ProductRow({
  product,
  index,
  active,
  onActivate,
  onDeactivate,
}: {
  product: Product;
  index: number;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block cursor-pointer overflow-hidden border-t border-mist"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      {/* Midnight sweep — grows from the bottom on enter, exits to the top */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-midnight will-change-transform"
        initial={false}
        animate={
          reduce
            ? { opacity: active ? 1 : 0, scaleY: 1 }
            : { opacity: 1, scaleY: active ? 1 : 0 }
        }
        style={{ originY: active ? 1 : 0 }}
        transition={{ duration: reduce ? 0.2 : 0.4, ease: EXPO }}
      />

      <div className="relative z-10 flex flex-col gap-3 px-1 py-8 md:py-10 lg:grid lg:grid-cols-[7rem_1fr_minmax(0,20rem)_3.5rem] lg:items-center lg:gap-8">
        {/* Index + tag */}
        <span
          className={`text-sm tabular-nums transition-colors duration-300 ${
            active ? "text-brass" : "text-brass-deep"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
          <span className="mx-2 opacity-40">/</span>
          {product.tag}
        </span>

        {/* Name */}
        <span
          className={`font-display text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.05] tracking-tight transition-colors duration-300 ${
            active ? "text-violet-bright" : "text-ink"
          }`}
        >
          {product.name}
        </span>

        {/* Description */}
        <span
          className={`max-w-md text-sm leading-relaxed transition-colors duration-300 md:text-base ${
            active ? "text-lavender-dim" : "text-ink-muted"
          }`}
        >
          {product.description}
        </span>

        {/* Trailing arrow — slides in on hover/focus */}
        <span
          aria-hidden
          className={`hidden justify-self-end transition-all duration-300 ease-out lg:block ${
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
        {/* Asymmetric heading — headline pushed right, note anchored bottom-left */}
        <div className="mb-16 md:mb-20 lg:mb-24 lg:flex lg:flex-row-reverse lg:items-end lg:justify-between lg:gap-16">
          <RevealWords
            text="Five instruments. One discipline."
            as="h2"
            accent={["discipline."]}
            className="block max-w-[16ch] font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight lg:ml-auto lg:text-right"
          />
          <FadeUp delay={0.25} className="mt-6 lg:mt-0 lg:max-w-sm lg:pb-2">
            <p className="max-w-md text-base text-ink-muted md:text-lg">
              SEBI-regulated products, matched to your goals, horizon and
              appetite for risk.
            </p>
          </FadeUp>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-16 xl:grid-cols-[1fr_22rem]">
          {/* The index */}
          <div className="border-b border-mist">
            {PRODUCTS.map((product, i) => (
              <FadeUp key={product.tag} delay={0.08 + i * 0.07}>
                <ProductRow
                  product={product}
                  index={i}
                  active={activeIndex === i}
                  onActivate={() => activate(i)}
                  onDeactivate={() => setActiveIndex(null)}
                />
              </FadeUp>
            ))}
          </div>

          {/* Fixed preview panel — crossfades a glyph per product (lg+) */}
          <FadeUp delay={0.3} className="hidden lg:block lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-midnight">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={preview.tag}
                  className="absolute inset-0 flex flex-col justify-between p-8"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.3, ease: EXPO }}
                >
                  <span className="text-sm tabular-nums text-brass">
                    {String(previewIndex + 1).padStart(2, "0")}
                    <span className="mx-2 opacity-40">/</span>
                    05
                  </span>
                  <svg
                    viewBox="0 0 120 120"
                    className="mx-auto w-3/5 text-violet-bright"
                    aria-hidden
                  >
                    {PRODUCT_GLYPHS[preview.tag]}
                  </svg>
                  <span className="font-display text-lg text-lavender">
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
