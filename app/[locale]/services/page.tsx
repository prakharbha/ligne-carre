import { getServices, getPageBanner } from '@/lib/sanity/fetch';
import ServicesPage from './page-client';
import { Metadata } from 'next';
import { generateListingMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateListingMetadata(locale as 'en' | 'fr', '/services', 'services');
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const services = await getServices();
  const pageBanner = await getPageBanner('services');

  return <ServicesPage services={services || []} pageBanner={pageBanner} locale={locale as 'en' | 'fr'} />;
}
