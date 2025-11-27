import { getBannerImages, getSiteSettings } from '@/lib/sanity/fetch';
import HomePage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [bannerImages, siteSettings] = await Promise.all([
    getBannerImages(),
    getSiteSettings(),
  ]);

  return (
    <HomePage
      bannerImages={bannerImages || []}
      siteSettings={siteSettings}
      locale={locale as 'en' | 'fr'}
    />
  );
}
