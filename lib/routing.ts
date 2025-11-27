type RouteKey = '/' | '/about' | '/services' | '/portfolio' | '/news' | '/careers' | '/contact' | '/privacy';

// Define pathnames directly without importing routing to avoid circular dependencies
const pathnames: Record<string, string | { en: string; fr: string }> = {
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
};

/**
 * Get the locale-specific pathname for a route
 */
export function getLocalizedPath(route: RouteKey, locale: 'en' | 'fr'): string {
  if (route === '/') {
    return `/${locale}`;
  }
  
  const pathname = pathnames[route];
  if (typeof pathname === 'string') {
    return `/${locale}${pathname}`;
  }
  
  if (pathname && typeof pathname === 'object') {
    return `/${locale}${pathname[locale]}`;
  }
  
  return `/${locale}${route}`;
}

