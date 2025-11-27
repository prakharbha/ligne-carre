import { getPageContent, getSiteSettings } from '@/lib/sanity/fetch';
import ContactPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [pageContent, siteSettings] = await Promise.all([
    getPageContent('contact'),
    getSiteSettings(),
  ]);

  return (
    <ContactPage
      pageContent={pageContent}
      siteSettings={siteSettings}
      locale={locale as 'en' | 'fr'}
    />
  );
}
