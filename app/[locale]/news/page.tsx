import { getNewsArticles } from '@/lib/sanity/fetch';
import NewsPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const articles = await getNewsArticles();

  return <NewsPage articles={articles || []} locale={locale as 'en' | 'fr'} />;
}
