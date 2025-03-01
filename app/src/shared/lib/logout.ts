import { APP_API_URL } from '@/shared/constants';

export async function logout() {
  return fetch(`${APP_API_URL}/auth/signout`, {
    method: 'POST',
    credentials: 'include',
  });
}
