import { getPageContent, getPageBanner, getTeamMembers } from '@/lib/sanity/fetch';
import AboutPageClient from './page-client';

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
