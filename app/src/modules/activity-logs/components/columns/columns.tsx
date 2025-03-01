'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import type { ActivityLog } from '@/modules/activity-logs/types/activity-log.type';
import AvatarInitials from '@/shared/components/avatar-initials';
import DateCell from '@/shared/components/table/columns/date-cell';
import Header from '@/shared/components/table/columns/header';
import SortableColumn from '@/shared/components/table/columns/sortable-column';
import { Badge } from '@/shared/components/ui/badge';

export const columns: ColumnDef<ActivityLog & { isSubRow: boolean }>[] = [
  {
    accessorKey: 'expand',
    cell: ({ row }) => (
      <button
        className="flex cursor-pointer items-center justify-center"
        onClick={row.getToggleExpandedHandler()}
      >
        {row.getIsExpanded() ? (
          <ChevronUpIcon className="size-5" />
        ) : (
          <ChevronDownIcon className="size-5" />
        )}
      </button>
    ),
    header: props => <Header {...props} title="" isSortingEnabled={false} />,
    enableSorting: false,
  },
  {
    accessorKey: 'action',
    header: row => (
      <SortableColumn
        {...row}
        title="activityLogs.filterModal.columns.action"
      />
    ),
    cell: ({ row }) => {
      const action = row.getValue('action') as string;
      return (
        <Badge variant="outline" className="font-mono">
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'entityType',
    header: row => (
      <SortableColumn
        {...row}
        title="activityLogs.filterModal.columns.entityType"
      />
    ),
    cell: ({ row }) => {
      const entityType = row.getValue('entityType') as string;
      return (
        <Badge variant="outline" className="font-mono capitalize">
          {entityType.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'entityId',
    header: row => (
      <SortableColumn
        {...row}
        title="activityLogs.filterModal.columns.entityId"
      />
    ),
    cell: ({ row }) => {
      const entityId = row.getValue('entityId') as string;
      return <span className="font-mono text-sm">{entityId}</span>;
    },
  },
  {
    accessorKey: 'user',
    header: row => (
      <SortableColumn
        {...row}
        isSortingEnabled={false}
        title="activityLogs.filterModal.columns.user"
      />
    ),
    cell: ({ row }) => {
      const user = row.getValue('user') as ActivityLog['user'];
      return (
        <div className="flex min-w-max items-center gap-2">
          <AvatarInitials
            name={user?.name?.substring(0, 2).toUpperCase()}
            className="h-8 w-8"
            alt={user?.name}
            src=""
          />
          <div className="flex flex-col">
            <span className="font-medium">{user?.name}</span>
            <span className="text-muted-foreground text-sm">{user?.email}</span>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: row => (
      <SortableColumn
        {...row}
        title="activityLogs.filterModal.columns.createdAt"
      />
    ),
    cell: data => <DateCell withTime {...data} />,
  },
];
