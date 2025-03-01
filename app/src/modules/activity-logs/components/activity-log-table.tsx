'use client';

import type { ColumnDef } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

import { columns } from '@/modules/activity-logs/components/columns/columns';
import type { ActivityLog } from '@/modules/activity-logs/types/activity-log.type';
import DataTable from '@/shared/components/table';

const RowRenderer = dynamic(
  () => import('@/modules/activity-logs/components/columns/row-renderer'),
  { ssr: false }
);

type Props = Readonly<{
  pageCount: number;
  initialData: ActivityLog[];
  searchState: {
    pageIndex: number;
    pageSize: number;
  };
  rowCount: number;
  initialSorting: {
    id: string;
    desc: boolean;
  }[];
}>;

export type ActivityLogWithSubRow = ActivityLog & { isSubRow: boolean };

export default function ActivityLogTable({
  pageCount,
  initialData,
  searchState,
  rowCount,
  initialSorting,
}: Props) {
  const getSubRows = useCallback((originalRow: ActivityLogWithSubRow) => {
    if (originalRow.isSubRow || !originalRow.details) {
      return undefined;
    }

    return [{ ...originalRow, isSubRow: true }];
  }, []);

  return (
    <DataTable<ActivityLogWithSubRow>
      columns={columns as ColumnDef<ActivityLogWithSubRow>[]}
      pageCount={pageCount}
      initialData={initialData as ActivityLogWithSubRow[]}
      searchState={searchState}
      to="/dashboard/activity-logs"
      rowCount={rowCount}
      initialSorting={initialSorting}
      getSubRows={getSubRows}
      RenderSubComponent={RowRenderer}
    />
  );
}
