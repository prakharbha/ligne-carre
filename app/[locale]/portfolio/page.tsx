import { getPortfolioItems } from '@/lib/sanity/fetch';
import PortfolioPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await getPortfolioItems();

  return <PortfolioPage items={items || []} locale={locale as 'en' | 'fr'} />;
}
