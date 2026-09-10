import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle, getArticleBody } from "@/lib/articles";
import { LEGAL_NAME, OG_DEFAULTS, SITE_NAME, SITE_URL } from "@/lib/site";
import ArticlePage from "@/components/pages/ArticlePage";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

/**
 * The route's own path, from the slug the registry holds rather than the one
 * that arrived in `params`, so the canonical, `og:url` and the JSON-LD
 * `mainEntityOfPage` are all the spelling the site publishes — and all three
 * are built from this one function, so they cannot disagree with each other.
 */
const articlePath = (slug: string) => `/insights/${slug}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  /**
   * `metaTitle` where the article has one, and the short " | Platizio" suffix
   * rather than " | Platizio Insights". Together they keep every article's
   * search title inside the ~60 characters a result shows; before this all five
   * overflowed and truncated mid-clause, the two longest by more than double.
   * The nine characters the suffix gives back are what let the shortened titles
   * stay descriptive rather than clipped.
   *
   * `og:title` deliberately uses the SAME short form. A share card is a
   * headline in a small box, so the constraint is the same one, and letting the
   * two drift would mean the card and the search result naming the same article
   * differently.
   */
  const title = `${article.metaTitle ?? article.title} | Platizio`;
  const path = articlePath(article.slug);

  return {
    title,
    description: article.metaDescription,

    /**
     * Per-route by necessity, not preference (audit finding M-03) — and on
     * this segment the defect was live, not hypothetical. Metadata merges
     * *shallowly*: with no `openGraph` here, every article inherited the root
     * layout's object whole, so each one shared as the homepage — `og:title`
     * "Platizio — Navigate Every Market With Confidence", `og:url` the site
     * root. Spreading `OG_DEFAULTS` restores `og:site_name` and `og:locale`,
     * which a bare `openGraph: { title }` would drop instead.
     *
     * `type` overrides the "website" in `OG_DEFAULTS` — this is the one
     * segment on the site that is a piece of writing rather than a page about
     * the firm — and it is what makes `publishedTime` legal: `article:*`
     * properties are only read when `og:type` is "article". No `authors`: the
     * Open Graph spec wants a profile URL there and there is no author page to
     * point at, so the byline is carried by the JSON-LD `author` below, where
     * an Organization is a valid value.
     */
    alternates: { canonical: path },
    openGraph: {
      ...OG_DEFAULTS,
      type: "article",
      title,
      description: article.metaDescription,
      url: path,
      publishedTime: article.iso,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  /**
   * Article structured data (audit finding M-04). The Organization JSON-LD in
   * `app/layout.tsx` tells a search engine who publishes this site; without
   * this, nothing tells it that these five pages are dated articles rather
   * than more marketing copy — which is what an "Article" rich result and a
   * publication date in the SERP are built from.
   *
   * `BlogPosting` rather than the broader `Article`: it is a subtype, so every
   * Article-level property still applies, and it states what these actually
   * are — dated commentary on a firm's insights section.
   *
   * `author` and `publisher` are both the firm, which is the truth: the
   * articles carry no byline. Both point at `#organization` — the `@id` the
   * root layout's `FinancialService` node was given for exactly this, per the
   * note on it — so the two graphs join into one entity instead of describing
   * a second, unrelated Platizio. The type and names are repeated alongside
   * the `@id` so that the node still validates read on its own, which is how
   * some consumers (and Google's Rich Results Test) treat a page in isolation.
   * They mirror the root node's `name`/`legalName` pair exactly rather than
   * collapsing to one of them: a consumer that merges the two nodes by `@id`
   * would otherwise find one entity claiming two different `name`s.
   *
   * No `dateModified`: nothing in the repository tracks when an article was
   * last revised, and inventing one from the build time would tell crawlers
   * all five changed on every deploy — the same reasoning that keeps
   * `lastModified` off the marketing routes in `app/sitemap.ts`.
   */
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.iso,
    articleSection: article.category,
    author: organization,
    publisher: organization,
    mainEntityOfPage: {
      "@type": "WebPage",
      // Absolute, composed the way `app/sitemap.ts` composes its entries —
      // JSON-LD has no `metadataBase` to resolve a relative path against.
      "@id": new URL(articlePath(article.slug), SITE_URL).toString(),
    },
  };

  return (
    <>
      {/*
        The documented way to emit JSON-LD — `next/script` is for executable
        code, this is data. A real object through `JSON.stringify`, never an
        interpolated template string, so it cannot be emitted malformed; the
        `<` escape is the sanitising step the Next.js JSON-LD guide asks for,
        so an article title or excerpt that ever grows a `</script>` cannot
        close this tag early. It renders nothing, so it is inert with respect
        to the page's entrance choreography.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ArticlePage article={article} body={getArticleBody(slug)} />
    </>
  );
}
