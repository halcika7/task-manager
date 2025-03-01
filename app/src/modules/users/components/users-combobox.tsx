'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import type { UsersResponse } from '@/modules/users/service/get-users';
import FormCombobox from '@/shared/components/form/combobox';
import { httpClient } from '@/shared/lib/http-client';
import {
  getNextPageParam,
  getPreviousPageParam,
} from '@/shared/utils/query-client-get-pages';

type Props<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
}>;

export default function UsersCombobox<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  emptyMessage,
}: Props<T>) {
  const { data, isLoading, isPending, hasNextPage, fetchNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ['users', name],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await httpClient.get<UsersResponse>(
          `/users?page=${pageParam}&limit=5`
        );
        return response.data;
      },
      initialPageParam: 1,
      getNextPageParam,
      getPreviousPageParam,
      enabled: true,
    });

  const allUsers = useMemo(() => {
    return (data?.pages.flatMap(page => page?.data || []) || []).map(user => ({
      label: user.name,
      value: user.id,
    }));
  }, [data]);

  return (
    <FormCombobox
      control={control}
      name={name}
      options={allUsers}
      isLoading={isFetching}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      emptyMessage={emptyMessage}
      loadMore={
        hasNextPage && !isFetching && !isPending && !isLoading
          ? fetchNextPage
          : undefined
      }
    />
  );
}
