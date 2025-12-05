import { getPageContent, getPageBanner } from '@/lib/sanity/fetch';
import PrivacyPage from './page-client';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageContent = await getPageContent('privacy');
  return generatePageMetadata(pageContent, locale as 'en' | 'fr', '/privacy');
}

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
