import { getPageContent, getSiteSettings, getPageBanner } from '@/lib/sanity/fetch';
import ContactPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [pageContent, siteSettings, pageBanner] = await Promise.all([
    getPageContent('contact'),
    getSiteSettings(),
    getPageBanner('contact'),
  ]);

  return (
    <ContactPage
      pageContent={pageContent}
      siteSettings={siteSettings}
      pageBanner={pageBanner}
      locale={locale as 'en' | 'fr'}
    />
  );
}
