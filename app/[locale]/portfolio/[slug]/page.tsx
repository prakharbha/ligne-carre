import { getPortfolioItemBySlug } from '@/lib/sanity/fetch';
import { notFound } from 'next/navigation';
import PortfolioItemPage from './page-client';

// Revalidate every 60 seconds to ensure fresh data and images
export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const portfolioItem = await getPortfolioItemBySlug(slug, locale as 'en' | 'fr');

  if (!portfolioItem) {
    notFound();
  }

  return (
    <PortfolioItemPage
      portfolioItem={portfolioItem}
      locale={locale as 'en' | 'fr'}
    />
  );
}

