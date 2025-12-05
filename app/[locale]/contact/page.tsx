import { getPageContent, getSiteSettings, getPageBanner } from '@/lib/sanity/fetch';
import ContactPage from './page-client';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageContent = await getPageContent('contact');
  return generatePageMetadata(pageContent, locale as 'en' | 'fr', '/contact');
}

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
