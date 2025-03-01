import type { User } from '@/modules/users/types/user.type';
import { httpClient } from '@/shared/lib/http-client';

export const getMe = async () => {
  try {
    const response = await httpClient.get<User>('/users/user/me');
    return response.data;
  } catch {
    return null;
  }
};
