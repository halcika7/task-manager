import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import {
  getSession,
  getSessionObject,
  shouldRefreshToken,
} from '@/modules/auth/lib/session';
import { routing } from '@/modules/i18n/routing';
import { DEVICE_TYPE_COOKIE } from '@/shared/constants';
import { httpClient } from '@/shared/lib/http-client';

// Create intl middleware
const withIntl = createIntlMiddleware(routing);

// Define public and protected paths
const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
const protectedPaths = ['/dashboard'];

type SessionObject = Awaited<ReturnType<typeof getSessionObject>>;

const applySession = async (
  res: NextResponse,
  sessionObject: SessionObject | null
) => {
  if (sessionObject) {
    const { session, ...rest } = sessionObject;
    res.cookies.set('session', session, rest);
  } else {
    res.cookies.delete('session');
  }

  res.headers.set('Set-Cookie', res.cookies.toString());
};

const createResponse = async (
  url: string,
  sessionObject: SessionObject | null,
  origin: string
) => {
  const response = NextResponse.redirect(new URL(url, origin));
  await applySession(response, sessionObject);

  return response;
};

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

export default async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Check if the path is public or protected
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  // Get session and check authentication status
  const session = await getSession(false);
  let isLoggedIn = false;
  let sessionObject: SessionObject | null = null;

  if (session) {
    const shouldRefresh = await shouldRefreshToken();

    if (shouldRefresh.shouldRefresh) {
      try {
        const refreshedTokens = await httpClient.refreshToken(
          session.refreshToken
        );

        if (refreshedTokens) {
          isLoggedIn = true;
          sessionObject = await getSessionObject({
            user: session.user,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken,
          });
        }
      } catch {
        isLoggedIn = false;
        sessionObject = null;
      }
    } else {
      isLoggedIn = shouldRefresh.isLoggedIn;
      // Preserve the session object even when not refreshing
      if (isLoggedIn) {
        sessionObject = await getSessionObject({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        });
      }
    }
  }

  // Handle authentication redirects
  if (isAuthPath && isLoggedIn) {
    return createResponse('/dashboard', sessionObject, origin);
  }

  if (isProtectedPath && !isLoggedIn) {
    return createResponse('/auth/login', sessionObject, origin);
  }

  const rsp = withIntl(req);

  await applySession(rsp, sessionObject);

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
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all api routes
    // Skip all public files
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|manifest.json|icons).*)',
  ],
};
