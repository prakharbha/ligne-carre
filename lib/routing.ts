import { routing } from '@/i18n/routing';

type RouteKey = '/' | '/about' | '/services' | '/portfolio' | '/news' | '/careers' | '/contact' | '/privacy';

/**
 * Get the locale-specific pathname for a route
 */
export function getLocalizedPath(route: RouteKey, locale: 'en' | 'fr'): string {
  const pathnames = routing.pathnames;
  
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

