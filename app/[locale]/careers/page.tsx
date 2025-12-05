import { getPageContent, getPageBanner } from '@/lib/sanity/fetch';
import CareersPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [pageContent, pageBanner] = await Promise.all([
    getPageContent('careers'),
    getPageBanner('careers'),
  ]);

  return <CareersPage pageContent={pageContent} pageBanner={pageBanner} locale={locale as 'en' | 'fr'} />;
}
