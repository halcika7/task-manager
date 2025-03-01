import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';

export const usersSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(''),
  role: parseAsStringEnum(['ADMIN', 'USER']),
  dateFrom: parseAsString.withDefault(''),
  dateTo: parseAsString.withDefault(''),
  orderBy: parseAsString.withDefault('createdAt'),
  orderDir: parseAsString.withDefault('desc'),
};

export const loaderUsersParams = createLoader(usersSearchParams);

export const serializeUsersParams = createSerializer(usersSearchParams);

export type UsersSearchParams = Awaited<ReturnType<typeof loaderUsersParams>>;
