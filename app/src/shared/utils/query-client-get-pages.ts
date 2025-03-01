import type { ManyResponse } from '@/shared/types/many-reponse.type';

export const getNextPageParam = <T>(
  lastPage: ManyResponse<T> | null,
  _: (ManyResponse<T> | null)[],
  lastPageParam: number
) => {
  if (lastPage?.meta?.hasNextPage) {
    return lastPageParam + 1;
  }
  return undefined;
};

export const getPreviousPageParam = <T>(
  _: ManyResponse<T> | null,
  __: (ManyResponse<T> | null)[],
  firstPageParam: number
) => {
  if (firstPageParam < 1) {
    return undefined;
  }
  return firstPageParam - 1;
};
