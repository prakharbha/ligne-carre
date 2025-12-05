import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing.config';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass password protection for:
  // - API routes
  // - Next.js internals
  // - Sanity Studio
  // - Static files (files with extensions)
  // - Password page itself
  // - Well-known paths (for SSL certificates)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/.well-known') ||
    pathname.startsWith('/password') ||
    pathname.includes('.')
  ) {
    return intlMiddleware(request);
  }

  // Check for authentication cookie
  const authCookie = request.cookies.get('site-auth');
  const isAuthenticated = authCookie?.value === 'authenticated';

  // If not authenticated, redirect to password page
  if (!isAuthenticated) {
    const passwordUrl = new URL('/password', request.url);
    passwordUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(passwordUrl);
  }

  // User is authenticated, proceed with i18n middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)']
};

