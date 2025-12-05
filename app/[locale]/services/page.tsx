import { getServices, getPageBanner } from '@/lib/sanity/fetch';
import ServicesPage from './page-client';

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
