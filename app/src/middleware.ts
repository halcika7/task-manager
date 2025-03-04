import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { auth } from '@/modules/auth/lib';
import { routing } from '@/modules/i18n/routing';
import { DEVICE_TYPE_COOKIE } from '@/shared/constants';

// Create intl middleware
const withIntl = createIntlMiddleware(routing);

// Define public and protected paths
const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
const protectedPaths = ['/dashboard'];

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  // Regex patterns for device detection
  const mobilePattern =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletPattern = /iPad|Android(?!.*Mobile)|Tablet/i;

  if (tabletPattern.test(userAgent)) return 'tablet';
  if (mobilePattern.test(userAgent)) return 'mobile';
  return 'desktop';
}

export default auth(async req => {
  const { pathname, origin } = req.nextUrl;

  const session = !!req.auth?.user;

  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/auth/login', origin));
  }

  const rsp = withIntl(req);

  const currentDeviceType = req.cookies.get(DEVICE_TYPE_COOKIE)?.value;
  const userAgent = req.headers.get('user-agent') || '';
  const deviceType = getDeviceType(userAgent);

  // Only set the cookie if it doesn't exist or is different
  if (deviceType !== currentDeviceType) {
    rsp.cookies.set(DEVICE_TYPE_COOKIE, deviceType, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  }

  return rsp;
});

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all api routes
    // Skip all public files
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|manifest.json|icons).*)',
  ],
};
