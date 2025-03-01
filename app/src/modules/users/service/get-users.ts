import type { User } from '@/modules/users/types/user.type';
import type { UsersSearchParams } from '@/modules/users/utils/search-users-params';
import { serializeUsersParams } from '@/modules/users/utils/search-users-params';
import { httpClient } from '@/shared/lib/http-client';
import type { ManyResponse } from '@/shared/types/many-reponse.type';

export type UsersResponse = ManyResponse<User>;

export async function getUsers(queryParams: UsersSearchParams) {
  try {
    const queryString = await serializeUsersParams(queryParams);
    const response = await httpClient.get<UsersResponse>(
      `/users${queryString}`
    );
    return response.data;
  } catch {
    return null;
  }
}
