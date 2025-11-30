import { getBannerImages, getSiteSettings, getServices, getPortfolioItems } from '@/lib/sanity/fetch';
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
    getPortfolioItems(),
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
