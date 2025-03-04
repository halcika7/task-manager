import type { NextRequest } from 'next/server';
import { signIn } from '@/modules/auth/lib';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const userId = searchParams.get('userId');
  const name = searchParams.get('name');
  const role = searchParams.get('role');
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');

  if (!userId || !accessToken || !refreshToken) {
    return Response.redirect(new URL('/auth/login', request.url));
  }

  try {
    const result = await signIn('credentials', {
      redirect: false,
      user: JSON.stringify({
        id: userId,
        name,
        role,
      }),
      token: accessToken,
      refresh_token: refreshToken,
    });

    if (result?.error) {
      console.log('🚀 ~ GET ~ result?.error:', result?.error);
      return Response.redirect(
        new URL('/auth/login?error=GoogleAuthError', request.url)
      );
    }

    // Successful authentication
    return Response.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.log('🚀 ~ GET ~ error:', error);
    return Response.redirect(
      new URL('/auth/login?error=GoogleAuthError', request.url)
    );
  }
}
