import { getPageContent, getPageBanner } from '@/lib/sanity/fetch';
import PrivacyPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [pageContent, pageBanner] = await Promise.all([
    getPageContent('privacy'),
    getPageBanner('privacy'),
  ]);

  return <PrivacyPage pageContent={pageContent} pageBanner={pageBanner} locale={locale as 'en' | 'fr'} />;
}
