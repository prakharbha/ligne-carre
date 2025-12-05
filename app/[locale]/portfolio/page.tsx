import { getPortfolioItems, getPageBanner } from '@/lib/sanity/fetch';
import PortfolioPage from './page-client';

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
