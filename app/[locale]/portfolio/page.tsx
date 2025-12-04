import { getPortfolioItems } from '@/lib/sanity/fetch';
import PortfolioPage from './page-client';

// Revalidate every 60 seconds to ensure fresh data and images
export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const items = await getPortfolioItems();

  return <PortfolioPage items={items || []} locale={locale as 'en' | 'fr'} />;
}
