import type {
  ColumnDef,
  PaginationState,
  Row,
  SortingState,
  Updater,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import type { QueryParams } from 'next-intl/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useLocaleRouter } from '@/modules/i18n/routing';

type Props<T> = Readonly<{
  initialData: T[];
  searchState: PaginationState;
  columns: ColumnDef<T>[];
  initialSorting?: SortingState;
  pageCount?: number;
  getRowCanExpand?: (row: Row<T>) => boolean;
  rowCount?: number;
  to: string;
  getSubRows?: ((originalRow: T, index: number) => undefined | T[]) | undefined;
}>;

function useTable<T>({
  initialData,
  columns,
  initialSorting,
  searchState,
  pageCount,
  getRowCanExpand,
  rowCount,
  to,
  getSubRows,
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const router = useLocaleRouter();
  const searchParams = useSearchParams();

  const onSortingChange = useCallback(
    (newSorting: Updater<SortingState>) => {
      const updatedSorting =
        typeof newSorting === 'function' ? newSorting([]) : newSorting;

      setSorting(updatedSorting);

      const params: Record<string, unknown> = {};
      const firstElement = updatedSorting[0];

      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      params.orderBy = firstElement.id;
      params.orderDir = firstElement.desc ? 'desc' : 'asc';

      delete params.page;

      const newSearchParams: QueryParams = {};

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          newSearchParams[key] = value;
        } else {
          newSearchParams[key] = value as string;
        }
      });

      router.push({
        pathname: to as '/',
        query: newSearchParams,
      });
    },
    [searchParams, to, router]
  );

  const table = useReactTable({
    data: initialData,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex: searchState!.pageIndex - 1,
        pageSize: searchState!.pageSize,
      },
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getRowCanExpand,
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange,
    manualSorting: true,
    getSortedRowModel: getSortedRowModel(),
    rowCount: rowCount,
    enableSortingRemoval: false,
    getSubRows,
  });

  const getItemsPerPageParams = useCallback(
    (value: number) => {
      const params: Record<string, unknown> = {};

      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (value !== 10) {
        params.limit = value;
      } else {
        delete params.limit;
      }

      delete params.page;

      const newSearchParams: QueryParams = {};

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          newSearchParams[key] = value;
        } else {
          newSearchParams[key] = value as string;
        }
      });

      return newSearchParams;
    },
    [searchParams]
  );

  const onItemsPerPageChange = useCallback(
    (value: number) => {
      table.setPageSize(value);

      const query = getItemsPerPageParams(value);

      router.push({ pathname: to as '/', query: query });
    },
    [table, to, router, getItemsPerPageParams]
  );

  const onItemsPerPageHoverPrefetch = useCallback(
    (value: number) => {
      const query = getItemsPerPageParams(value);

      router.prefetch({ pathname: to as '/', query: query });
    },
    [router, to, getItemsPerPageParams]
  );

  const getPageParams = useCallback(
    (page: number) => {
      const params: Record<string, unknown> = {};

      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (page > 1) {
        params.page = page;
      } else {
        delete params.page;
      }

      const newSearchParams: QueryParams = {};

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          newSearchParams[key] = value;
        } else {
          newSearchParams[key] = value as string;
        }
      });

      return newSearchParams;
    },
    [searchParams]
  );

  const onPageChange = useCallback(
    (page: number) => {
      const query = getPageParams(page);
      router.push({ pathname: to as '/', query: query });
    },
    [to, router, getPageParams]
  );

  const onPageHoverPrefetch = useCallback(
    (page: number) => {
      const query = getPageParams(page);
      router.prefetch({ pathname: to as '/', query: query });
    },
    [router, to, getPageParams]
  );

  const returnValue = useMemo(() => {
    return {
      table,
      onItemsPerPageChange,
      onPageChange,
      onPageHoverPrefetch,
      onItemsPerPageHoverPrefetch,
    };
  }, [
    table,
    onItemsPerPageChange,
    onPageChange,
    onPageHoverPrefetch,
    onItemsPerPageHoverPrefetch,
  ]);

  return returnValue;
}

export default useTable;
