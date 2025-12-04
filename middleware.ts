import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing.config';
import { detectLocaleFromHeaders } from './lib/geolocation';

const PASSWORD = 'fadiisgreat';
const PASSWORD_COOKIE = 'site-auth';
const LOCALE_PREFERENCE_COOKIE = 'locale-preference';
const COOKIE_CONSENT_COOKIE = 'cookie-consent';

const intlMiddleware = createIntlMiddleware(routing);

// Helper function to check if user has consented to cookies
function hasCookieConsent(request: NextRequest): boolean {
  const consent = request.cookies.get(COOKIE_CONSENT_COOKIE)?.value;
  return consent === 'accepted';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to studio, API routes, static files, Next.js internals, and ACME challenge
  if (
    pathname.startsWith('/studio') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/.well-known') || // Allow ACME challenge for SSL certificates
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Extract locale from URL if present
  const localeFromUrl = pathname.startsWith('/en/') || pathname === '/en' 
    ? 'en' 
    : pathname.startsWith('/fr/') || pathname === '/fr' 
    ? 'fr' 
    : null;
  
  const hasLocalePrefix = localeFromUrl !== null;
  
  // Check for locale preference cookie
  const localePreference = request.cookies.get(LOCALE_PREFERENCE_COOKIE)?.value as 'en' | 'fr' | undefined;

  // Determine target locale: URL > Cookie > Geolocation > Default
  let targetLocale: 'en' | 'fr' = routing.defaultLocale as 'en' | 'fr';
  
  if (localeFromUrl) {
    targetLocale = localeFromUrl;
  } else if (localePreference) {
    targetLocale = localePreference;
  } else {
    // Geolocation-based locale detection (only on first visit)
    const country = request.headers.get('x-vercel-ip-country');
    const region = request.headers.get('x-vercel-ip-country-region');
    const detectedLocale = detectLocaleFromHeaders(country, region);
    if (detectedLocale) {
      targetLocale = detectedLocale;
    }
  }

  // Check if user is authenticated
  const isAuthenticated = request.cookies.get(PASSWORD_COOKIE)?.value === 'authenticated';

  // If not authenticated and trying to access the password page, allow it
  if (
    pathname === '/password' ||
    pathname.startsWith('/password/') ||
    pathname === '/en/password' ||
    pathname === '/fr/password' ||
    pathname.startsWith('/en/password/') ||
    pathname.startsWith('/fr/password/')
  ) {
    const response = NextResponse.next();
    // Set locale preference cookie only if user has consented to cookies
    if (hasCookieConsent(request) && !localePreference && !hasLocalePrefix && targetLocale !== routing.defaultLocale) {
      response.cookies.set(LOCALE_PREFERENCE_COOKIE, targetLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
    }
    return response;
  }

  // If not authenticated, redirect to password page
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/password';
    // Store the target locale and original path in redirect params
    if (pathname !== '/' && !pathname.startsWith('/password')) {
      url.searchParams.set('redirect', pathname);
    }
    if (targetLocale !== routing.defaultLocale) {
      url.searchParams.set('locale', targetLocale);
    }
    const response = NextResponse.redirect(url);
    // Set locale preference cookie only if user has consented to cookies
    if (hasCookieConsent(request) && !localePreference && !hasLocalePrefix && targetLocale !== routing.defaultLocale) {
      response.cookies.set(LOCALE_PREFERENCE_COOKIE, targetLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
    }
    return response;
  }

  // If authenticated and no locale in URL, redirect to locale-prefixed URL
  if (isAuthenticated && !hasLocalePrefix) {
    const url = request.nextUrl.clone();
    url.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`;
    const response = NextResponse.redirect(url);
    // Set locale preference cookie only if user has consented to cookies
    if (hasCookieConsent(request) && !localePreference && targetLocale !== routing.defaultLocale) {
      response.cookies.set(LOCALE_PREFERENCE_COOKIE, targetLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
    }
    return response;
  }

  // If authenticated, proceed with intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
};

