import { getServices } from '@/lib/sanity/fetch';
import ServicesPage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const services = await getServices();

  return <ServicesPage services={services || []} locale={locale as 'en' | 'fr'} />;
}
