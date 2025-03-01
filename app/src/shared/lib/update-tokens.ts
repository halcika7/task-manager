import { APP_API_URL } from '@/shared/constants';

export async function updateTokens(
  accessToken: string,
  refreshToken: string,
  locale: string
) {
  return fetch(`${APP_API_URL}/auth/update`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    },
    body: JSON.stringify({ accessToken, refreshToken }),
  });
}
