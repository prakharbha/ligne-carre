import { defineRouting } from 'next-intl/routing';

// Define the routing configuration with locale-specific pathnames
// This file contains ONLY the routing config, no navigation helpers
// to avoid circular dependencies in middleware
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
      fr: '/nos-services',
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

