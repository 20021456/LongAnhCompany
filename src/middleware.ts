import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { routing } from './lib/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes (locale-agnostic: /admin/* and /[locale]/admin/*)
  const isAdminRoute =
    pathname.startsWith('/admin') ||
    /^\/(vi|en|zh)\/admin(\/|$)/.test(pathname);

  if (isAdminRoute && !pathname.includes('/admin/login')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Admin pages are not localized — skip intl middleware
  if (pathname.startsWith('/admin')) return NextResponse.next();

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
