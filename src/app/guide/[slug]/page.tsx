import { notFound } from "next/navigation";
import { GUIDE, getArticleBySlug } from "@/lib/guide";
import ArticleView from "@/components/ArticleView";

export function generateStaticParams() {
  return GUIDE.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleView article={article} />;
}
