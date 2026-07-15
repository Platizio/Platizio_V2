import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle, getArticleBody } from "@/lib/articles";
import ArticlePage from "@/components/pages/ArticlePage";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Platizio Insights`,
    description: article.metaDescription,
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
  return <ArticlePage article={article} body={getArticleBody(slug)} />;
}
