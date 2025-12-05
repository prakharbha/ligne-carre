import { getNewsArticles, getPageBanner } from '@/lib/sanity/fetch';
import NewsPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const articles = await getNewsArticles();
  const pageBanner = await getPageBanner('news');

  return <NewsPage articles={articles || []} pageBanner={pageBanner} locale={locale as 'en' | 'fr'} />;
}
