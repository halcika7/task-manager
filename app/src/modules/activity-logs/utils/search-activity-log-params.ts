import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';

export const activityLogSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(''),
  action: parseAsString.withDefault(''),
  entityType: parseAsString.withDefault(''),
  dateFrom: parseAsString.withDefault(''),
  dateTo: parseAsString.withDefault(''),
  orderBy: parseAsString.withDefault('createdAt'),
  orderDir: parseAsStringEnum(['asc', 'desc']),
};

export const activityLogSearchParamsLoader = createLoader(
  activityLogSearchParams
);

export const serializeActivityLogSearchParams = createSerializer(
  activityLogSearchParams
);

export type ActivityLogSearchParams = Awaited<
  ReturnType<typeof activityLogSearchParamsLoader>
>;
