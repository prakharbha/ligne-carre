import { getNewsArticles, getPageBanner } from '@/lib/sanity/fetch';
import NewsPage from './page-client';
import { Metadata } from 'next';
import { generateListingMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateListingMetadata(locale as 'en' | 'fr', '/news', 'news');
}

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
