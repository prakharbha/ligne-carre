import { getBannerImages, getSiteSettings, getServices, getFeaturedPortfolioItems } from '@/lib/sanity/fetch';
import HomePage from './page-client';

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
