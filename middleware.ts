import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing.config';

const PASSWORD = 'fadiisgreat';
const PASSWORD_COOKIE = 'site-auth';

const intlMiddleware = createIntlMiddleware(routing);

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

  // Check if user is authenticated
  const isAuthenticated = request.cookies.get(PASSWORD_COOKIE)?.value === 'authenticated';

  // If authenticated, proceed with intl middleware
  if (isAuthenticated) {
    return intlMiddleware(request);
  }

  // If not authenticated and trying to access the password page, allow it
  // Also allow locale-specific password routes
  if (
    pathname === '/password' ||
    pathname.startsWith('/password/') ||
    pathname === '/en/password' ||
    pathname === '/fr/password' ||
    pathname.startsWith('/en/password/') ||
    pathname.startsWith('/fr/password/')
  ) {
    return NextResponse.next();
  }

  // Redirect to password page with redirect parameter
  const url = request.nextUrl.clone();
  url.pathname = '/password';
  if (pathname !== '/' && !pathname.startsWith('/password')) {
    url.searchParams.set('redirect', pathname);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
};

