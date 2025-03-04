import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import type { SearchParams } from 'nuqs';

import { auth } from '@/modules/auth/lib';
import ClearFiltersButton from '@/modules/tasks/components/clear-filters-button';
import TaskCreatedWebsocketHandler from '@/modules/tasks/components/task-created-websocket-handler';
import TaskDeletedWebsocketHandler from '@/modules/tasks/components/task-deleted-websocket-handler';
import TaskFilterModalTrigger from '@/modules/tasks/components/task-filter-modal/task-filter-modal-trigger';
import CreateTaskModalTrigger from '@/modules/tasks/components/task-modals/create-task-modal/create-task-modal-trigger';
import TaskReminderWebsocketHandler from '@/modules/tasks/components/task-reminder-websocket-handler';
import TaskUpdateWebsocketHandler from '@/modules/tasks/components/task-update-websocket-handler';
import { TaskActionProvider } from '@/modules/tasks/context/task-action.context';
import { getTasks } from '@/modules/tasks/service/get-tasks';
import { loaderTasksParams } from '@/modules/tasks/utils/search-tasks-params';

const TaskDetailsModals = dynamic(
  () => import('@/modules/tasks/components/task-modals/task-details-modals')
);

const DragDrop = dynamic(() => import('@/modules/tasks/components/drag-drop'));

const TaskSortSelect = dynamic(
  () => import('@/modules/tasks/components/task-sort-select')
);

type Props = Readonly<{
  searchParams: Promise<SearchParams>;
}>;

export default async function Page({ searchParams }: Props) {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }
  const params = await loaderTasksParams(searchParams);
  const tasks = await getTasks(params);

  return (
    <TaskActionProvider>
      <div className="flex w-full flex-col flex-wrap gap-2 rounded-lg py-2 backdrop-blur-sm md:flex-row md:items-center md:gap-2">
        <div className="flex w-max items-center gap-2">
          <TaskFilterModalTrigger />
          <TaskSortSelect />
          <ClearFiltersButton />
          <CreateTaskModalTrigger />
        </div>
      </div>
      <DragDrop tasks={tasks} />

      <TaskDetailsModals />
      <TaskCreatedWebsocketHandler />
      <TaskUpdateWebsocketHandler />
      <TaskDeletedWebsocketHandler />
      <TaskReminderWebsocketHandler />
    </TaskActionProvider>
  );
}
