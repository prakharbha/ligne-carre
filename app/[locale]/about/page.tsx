import { getPageContent } from '@/lib/sanity/fetch';
import AboutPageClient from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageContent = await getPageContent('about');

  return <AboutPageClient pageContent={pageContent} locale={locale as 'en' | 'fr'} />;
}
