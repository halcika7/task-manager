import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getSessionObject, updateTokens } from '@/modules/auth/lib/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessToken, refreshToken } = body;

    if (!accessToken || !refreshToken) {
      const response = NextResponse.json(
        { error: 'Provide Tokens' },
        { status: 401 }
      );
      response.cookies.delete('session');
      return response;
    }

    const obj = await updateTokens({ accessToken, refreshToken });

    const rsp = NextResponse.json({ success: true });

    if (obj) {
      const { session, ...sessionOptions } = await getSessionObject(obj);
      rsp.cookies.set('session', session, {
        ...sessionOptions,
      });
      rsp.headers.set('Set-Cookie', rsp.cookies.toString());
    }

    return rsp;
  } catch {
    return NextResponse.json(
      { error: 'Failed to update tokens' },
      { status: 500 }
    );
  }
}
