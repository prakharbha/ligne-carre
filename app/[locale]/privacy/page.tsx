import { getPageContent } from '@/lib/sanity/fetch';
import PrivacyPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageContent = await getPageContent('privacy');

  return <PrivacyPage pageContent={pageContent} locale={locale as 'en' | 'fr'} />;
}
