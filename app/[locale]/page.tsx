import { getBannerImages, getSiteSettings, getServices, getFeaturedPortfolioItems } from '@/lib/sanity/fetch';
import HomePage from './page-client';

// Revalidate every 60 seconds to ensure fresh data
export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [bannerImages, siteSettings, services, portfolioItems] = await Promise.all([
    getBannerImages(),
    getSiteSettings(),
    getServices(),
    getFeaturedPortfolioItems(),
  ]);

  return (
    <HomePage
      bannerImages={bannerImages || []}
      siteSettings={siteSettings}
      services={services || []}
      portfolioItems={portfolioItems || []}
      locale={locale as 'en' | 'fr'}
    />
  );
}
