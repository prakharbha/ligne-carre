import { getPageContent, getPageBanner, getTeamMembers } from '@/lib/sanity/fetch';
import AboutPageClient from './page-client';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageContent = await getPageContent('about');
  return generatePageMetadata(pageContent, locale as 'en' | 'fr', '/about');
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [pageContent, pageBanner, teamMembers] = await Promise.all([
    getPageContent('about'),
    getPageBanner('about'),
    getTeamMembers(),
  ]);

  return <AboutPageClient pageContent={pageContent} pageBanner={pageBanner} teamMembers={teamMembers || []} locale={locale as 'en' | 'fr'} />;
}
