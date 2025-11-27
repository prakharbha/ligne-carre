import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// Define the routing configuration with locale-specific pathnames
export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      fr: '/a-propos',
    },
    '/services': {
      en: '/services',
      fr: '/services',
    },
    '/portfolio': {
      en: '/portfolio',
      fr: '/portfolio',
    },
    '/news': {
      en: '/news',
      fr: '/actualites',
    },
    '/careers': {
      en: '/careers',
      fr: '/carrieres',
    },
    '/contact': {
      en: '/contact',
      fr: '/nous-contacter',
    },
    '/privacy': {
      en: '/privacy',
      fr: '/confidentialite',
    },
  },
});

// Create navigation helpers
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

