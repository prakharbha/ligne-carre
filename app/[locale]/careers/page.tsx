import { getPageContent, getPageBanner } from '@/lib/sanity/fetch';
import CareersPage from './page-client';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageContent = await getPageContent('careers');
  return generatePageMetadata(pageContent, locale as 'en' | 'fr', '/careers');
}

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
