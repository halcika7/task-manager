'use client';

import type {
  ColumnDef,
  PaginationState,
  Row,
  SortingState,
} from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import type { ComponentType } from 'react';
import { Fragment, useEffect, useMemo, useRef } from 'react';

import PaginationText from '@/shared/components/table/pagination/pagination-text';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableUI,
} from '@/shared/components/ui/table';
import useTable from '@/shared/hooks/use-table';
import { cn } from '@/shared/utils/cn';

const VisibleItemsDropdown = dynamic(
  () => import('@/shared/components/table/visible-items-dropdown'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-16" />,
  }
);

const Pagination = dynamic(
  () => import('@/shared/components/table/pagination'),
  { ssr: false }
);

export type CustomTableProps<T> = Readonly<{
  initialData: T[];
  searchState: PaginationState;
  columns: ColumnDef<T>[];
  getRowCanExpand?: (row: Row<T>) => boolean;
  RenderSubComponent?: ComponentType<Readonly<{ row: Row<T> }>>;
  initialSorting?: SortingState;
  pageCount?: number;
  withPaginationNumbers?: boolean;
  rowCount?: number;
  to: string;
  getSubRows?: (originalRow: T, index: number) => undefined | T[];
}>;

function Table<T>({
  columns,
  pageCount,
  initialData,
  searchState,
  to,
  rowCount,
  initialSorting,
  getRowCanExpand,
  RenderSubComponent,
  getSubRows,
}: CustomTableProps<T>) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('table');

  const {
    table,
    onItemsPerPageChange,
    onPageChange,
    onPageHoverPrefetch,
    onItemsPerPageHoverPrefetch,
  } = useTable({
    columns,
    initialData,
    initialSorting,
    searchState,
    pageCount,
    getRowCanExpand,
    rowCount,
    to,
    getSubRows,
  });

  const currentPage = useMemo(() => {
    return searchState?.pageIndex || 0;
  }, [searchState?.pageIndex]);

  useEffect(() => {
    const tableElement = tableWrapperRef.current;
    if (!tableElement) return;

    const handleScroll = () => {
      const isScrolled = tableElement.scrollLeft > 0;
      tableElement.setAttribute('data-scrolled', isScrolled ? 'true' : 'false');
    };

    tableElement.addEventListener('scroll', handleScroll);
    return () => tableElement.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="group/table-wrapper table-wrapper relative w-full overflow-auto"
        ref={tableWrapperRef}
        data-scrolled="false"
      >
        <TableUI className="table-auto">
          <TableHeader className="group/header" data-header="true">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.map(row => (
              <Fragment key={row.id}>
                {(row.original as { isSubRow?: boolean }).isSubRow ? null : (
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'group/row',
                      row.getIsExpanded() && 'bg-neutral-5'
                    )}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.columnDef.meta?.className}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
                {row.getIsExpanded() && RenderSubComponent && (
                  <RenderSubComponent row={row} />
                )}
              </Fragment>
            ))}
            {table.getRowModel().rows?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>
      <div className="grid grid-cols-1 justify-center gap-4 rounded-b border border-t-0 px-6 py-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-4">
          <div className="text-foreground relative flex items-center gap-2 text-sm">
            <p>{t('itemsPerPage')}</p>
            <VisibleItemsDropdown
              value={table.getState().pagination.pageSize}
              onChange={onItemsPerPageChange}
              isDisabled={!rowCount}
              onHoverPrefetch={onItemsPerPageHoverPrefetch}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <PaginationText
            currentPage={currentPage}
            numberOfPages={table.getPageCount()}
            perPage={table.getState().pagination.pageSize}
            rowCount={rowCount}
          />
          <Pagination
            canGoNext={!table.getCanNextPage()}
            canGoPrev={!table.getCanPreviousPage()}
            currentPage={currentPage}
            numberOfPages={table.getPageCount()}
            goTo={onPageChange}
            onPageHoverPrefetch={onPageHoverPrefetch}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
