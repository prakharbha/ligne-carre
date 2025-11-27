import { getPageContent } from '@/lib/sanity/fetch';
import CareersPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageContent = await getPageContent('careers');

  return <CareersPage pageContent={pageContent} locale={locale as 'en' | 'fr'} />;
}
