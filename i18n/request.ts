import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing.config';

export const locales = routing.locales;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is a Promise in Next.js 15+
  let locale = await requestLocale;
  
  // Ensure the locale is valid, default to 'en' if not
  if (!locale || !locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

