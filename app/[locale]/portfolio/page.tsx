import { getPortfolioItems, getPageBanner } from '@/lib/sanity/fetch';
import PortfolioPage from './page-client';
import { Metadata } from 'next';
import { generateListingMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateListingMetadata(locale as 'en' | 'fr', '/portfolio', 'portfolio');
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await getPortfolioItems();
  const pageBanner = await getPageBanner('portfolio');

  return <PortfolioPage items={items || []} pageBanner={pageBanner} locale={locale as 'en' | 'fr'} />;
}
