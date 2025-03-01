'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';

import type { User } from '@/modules/users/types/user.type';
import { UserRole } from '@/modules/users/types/user.type';
import DateCell from '@/shared/components/table/columns/date-cell';
import SortableColumn from '@/shared/components/table/columns/sortable-column';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

const UserActions = dynamic(
  () =>
    import('@/modules/users/components/columns/user-actions').then(
      mod => mod.UserActions
    ),
  {
    ssr: false,
    loading: () => (
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="size-4" />
      </Button>
    ),
  }
);

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: row => <SortableColumn {...row} title="users.columns.name" />,
    cell: ({ row }) => {
      return (
        <div className="flex min-w-max items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {row.original.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: row => <SortableColumn {...row} title="users.columns.email" />,
  },
  {
    accessorKey: 'role',
    header: row => <SortableColumn {...row} title="users.columns.role" />,
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.role === UserRole.ADMIN ? 'default' : 'secondary'
          }
        >
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: row => <SortableColumn {...row} title="users.columns.createdAt" />,
    cell: data => <DateCell withTime={false} {...data} />,
  },
  {
    id: 'actions',
    header: row => (
      <SortableColumn
        {...row}
        isSortingEnabled={false}
        title="users.columns.actions"
      />
    ),
    cell: ({ row }) => <UserActions user={row.original} />,
    enableSorting: false,
  },
];
