import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContactButton } from '@/components/FloatingContactButton';
import { getSiteSettings } from '@/lib/sanity/fetch';

export { generateMetadata } from './metadata';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [messages, siteSettings] = await Promise.all([
    getMessages({ locale }),
    getSiteSettings(),
  ]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer siteSettings={siteSettings} />
        <FloatingContactButton />
      </div>
    </NextIntlClientProvider>
  );
}

