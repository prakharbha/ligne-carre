import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing.config';
import { detectLocaleFromHeaders } from './lib/geolocation';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip geolocation detection if:
  // - URL already has a locale prefix
  // - User has a locale preference cookie
  // - It's an API route, static file, or special path
  const hasLocalePrefix = pathname.startsWith('/en/') || pathname.startsWith('/fr/');
  const localePreference = request.cookies.get('locale-preference');
  const isSpecialPath =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/.well-known') ||
    pathname.includes('.');

  // If user has a locale preference, use it
  if (localePreference && (localePreference.value === 'en' || localePreference.value === 'fr')) {
    return intlMiddleware(request);
  }

  // If URL already has locale, proceed with i18n middleware
  if (hasLocalePrefix) {
    return intlMiddleware(request);
  }

  // Skip geolocation for special paths
  if (isSpecialPath) {
    return intlMiddleware(request);
  }

  // Detect locale from geolocation (only on root path or paths without locale)
  if (pathname === '/' || (!hasLocalePrefix && !isSpecialPath)) {
    const country = request.headers.get('x-vercel-ip-country');
    const region = request.headers.get('x-vercel-ip-country-region');
    
    const detectedLocale = detectLocaleFromHeaders(country, region);
    
    if (detectedLocale === 'fr') {
      // Redirect to French version
      const url = request.nextUrl.clone();
      url.pathname = `/fr${pathname === '/' ? '' : pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // Proceed with default i18n middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)']
};

