"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { SiteShell } from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import ProductBlocks from "@/components/site/ProductBlocks";
import ContactCTA from "@/components/site/ContactCTA";

const SIF_INSIGHTS = "https://www.youtube.com/@sifinsights";

export default function ProductPage({ product }: { product: Product }) {
  const isSif = product.slug === "sif";

  return (
    <SiteShell>
      <nav aria-label="Breadcrumb" className="sr-only">
        <Link href="/products">Products</Link> / {product.name}
      </nav>

      <PageHero
        label={product.hero.label}
        headline={product.hero.headline}
        accent={product.hero.accent}
        intro={product.hero.intro}
        mark={product.glyph}
      />

      <ProductBlocks blocks={product.blocks} />

      <ContactCTA
        heading="See if this fits your plan."
        accent={["plan."]}
        body={`Book a consultation and we'll help you decide whether ${product.name} fits your goals, horizon and appetite for risk.`}
        buttonLabel="Book a Consultation"
        href="/contact"
        secondary={isSif ? { label: "Visit SIF Insights", href: SIF_INSIGHTS } : undefined}
      />
    </SiteShell>
  );
}
