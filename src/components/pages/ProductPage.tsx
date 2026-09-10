"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { PANEL_ARTWORK } from "@/lib/productArtwork";
import { SiteShell } from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import ProductBlocks from "@/components/site/ProductBlocks";
import ContactCTA from "@/components/site/ContactCTA";

const SIF_INSIGHTS = "https://www.youtube.com/@sifinsights";

export default function ProductPage({ product }: { product: Product }) {
  const isSif = product.slug === "sif";

  return (
    <SiteShell>
      {/* Screen-reader-only on purpose: the hero's label and the nav's active
          state already place the page for a sighted visitor, so a drawn trail
          would be a third copy of the same fact. It still has to be a real
          ordered list, though — the bare "Products / name" this replaced was
          announced as one run of text, so the trail had no depth, no step
          count, and no way to tell the link from the page you are on.
          aria-current="page" marks that last step, which is what stops screen
          readers reading the leaf as somewhere else you could go. */}
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <PageHero
        label={product.hero.label}
        headline={product.hero.headline}
        accent={product.hero.accent}
        intro={product.hero.intro}
        markSrc={PANEL_ARTWORK[product.tag]}
      />

      <ProductBlocks blocks={product.blocks} />

      <ContactCTA
        heading="See if this fits your plan."
        accent={["plan."]}
        body={`Book a consultation and we'll help you decide whether ${product.name} fits your goals, horizon and appetite for risk.`}
        buttonLabel="Book a consultation"
        href="/contact"
        secondary={isSif ? { label: "Visit SIF Insights", href: SIF_INSIGHTS } : undefined}
      />
    </SiteShell>
  );
}
