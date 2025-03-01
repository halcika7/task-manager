'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/shared/components/ui/skeleton';

const TaskSortSelect = dynamic(
  () => import('@/modules/tasks/components/task-sort-select/task-sort-select'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-40" />,
  }
);

export default function TaskSortSelectTrigger() {
  return <TaskSortSelect />;
}
