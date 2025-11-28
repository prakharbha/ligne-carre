import { getBannerImages, getSiteSettings, getServices } from '@/lib/sanity/fetch';
import HomePage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [bannerImages, siteSettings, services] = await Promise.all([
    getBannerImages(),
    getSiteSettings(),
    getServices(),
  ]);

  return (
    <HomePage
      bannerImages={bannerImages || []}
      siteSettings={siteSettings}
      services={services || []}
      locale={locale as 'en' | 'fr'}
    />
  );
}
