import { Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';

import { getTranslations } from 'next-intl/server';
import { getSession } from '@/modules/auth/lib/session';
import CommentSection from '@/modules/comments/components/comment-section';
import { getComments } from '@/modules/comments/service/get-comments';
import TaskCreatedWebsocketHandler from '@/modules/tasks/components/task-created-websocket-handler';
import TaskDeletedWebsocketHandler from '@/modules/tasks/components/task-deleted-websocket-handler';
import DeleteTaskAlertTrigger from '@/modules/tasks/components/task-modals/delete-task-alert/delete-task-alert-trigger';
import EditTaskTrigger from '@/modules/tasks/components/task-modals/edit-task-modal/edit-task-trigger';
import TaskReminderWebsocketHandler from '@/modules/tasks/components/task-reminder-websocket-handler';
import TaskUpdateWebsocketHandler from '@/modules/tasks/components/task-update-websocket-handler';
import { TaskActionProvider } from '@/modules/tasks/context/task-action.context';
import { getTask } from '@/modules/tasks/service/get-task';
import {
  priorityColors,
  priorityLabels,
  statusColors,
  statusLabels,
} from '@/modules/tasks/utils/labels';
import AvatarInitials from '@/shared/components/avatar-initials';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import dayjs from '@/shared/lib/dayjs';
import { cn } from '@/shared/utils/cn';

const TaskDetailsModals = dynamic(
  () => import('@/modules/tasks/components/task-modals/task-details-modals')
);

type Props = Readonly<{
  params: Promise<{
    taskId: string;
  }>;
}>;

export default async function Page({ params }: Props) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { taskId } = await params;

  const [task, comments, t] = await Promise.all([
    getTask(taskId),
    getComments(taskId, 1, 10),
    getTranslations('tasks'),
  ]);

  if (!task?.id) {
    notFound();
  }

  return (
    <TaskActionProvider initialSelectedData={task}>
      <div className="container max-w-5xl space-y-8 py-8">
        <Card className="from-background to-background/30 overflow-hidden bg-gradient-to-b">
          <CardHeader className="space-y-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      statusColors[task.status]
                    )}
                  >
                    {t(statusLabels[task.status])}
                  </Badge>
                  <Badge
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      priorityColors[task.priority]
                    )}
                  >
                    {t(priorityLabels[task.priority])}
                  </Badge>
                </div>
                <h1 className="text-2xl font-semibold">{task.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {t('dueDate', {
                      date: dayjs(task.dueDate).format('DD/MM/YYYY'),
                    })}
                  </span>
                </div>
                <EditTaskTrigger />
                <DeleteTaskAlertTrigger />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  <div className="ring-background relative h-8 w-8 overflow-hidden rounded-full ring-2">
                    <AvatarInitials
                      name={task.assignedTo?.name ?? 'N N'}
                      src=""
                      alt={task.assignedTo?.name ?? 'NN'}
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="border-background absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {task.assignedTo?.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t('assignedTo')}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h2 className="font-semibold">{t('description')}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {task.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <CommentSection taskId={task.id} comments={comments} />
            </div>
          </CardContent>
        </Card>

        <TaskDetailsModals withRedirect />
      </div>

      <TaskReminderWebsocketHandler withLink={false} />
      <TaskDeletedWebsocketHandler withRedirect />
      <TaskUpdateWebsocketHandler withRefresh />
      <TaskCreatedWebsocketHandler />
    </TaskActionProvider>
  );
}
