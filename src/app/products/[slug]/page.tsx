import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/products";
import { OG_DEFAULTS } from "@/lib/site";
import ProductPage from "@/components/pages/ProductPage";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  /**
   * The route's own path, built from the slug the registry holds rather than
   * the one that arrived in `params`, so the canonical is always the spelling
   * the site publishes. `dynamicParams = false` means the two can only ever
   * differ by a redirect, but a canonical is exactly the field that must name
   * the one true URL.
   */
  const path = `/products/${product.slug}`;

  return {
    title: product.metaTitle,
    description: product.metaDescription,

    /**
     * Per-route by necessity, not preference (audit finding M-03) — and on
     * this segment the defect was live, not hypothetical. Metadata merges
     * *shallowly*: with no `openGraph` here, all five product pages inherited
     * the root layout's object whole, so /products/sif shared to WhatsApp or
     * X as the homepage — `og:title` "Platizio — Navigate Every Market With
     * Confidence", `og:url` the site root. Spreading `OG_DEFAULTS` restores
     * `og:site_name`, `og:locale` and `og:type`, which a bare
     * `openGraph: { title }` would drop instead. See `lib/site.ts`.
     */
    alternates: { canonical: path },
    openGraph: {
      ...OG_DEFAULTS,
      title: product.metaTitle,
      description: product.metaDescription,
      url: path,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
