import { CalendarClock, CheckCircle2, Clock, Folder, Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ActivityLog } from '@/modules/activity-logs/types/activity-log.type';
import { ActivityLogActions } from '@/modules/activity-logs/types/activity-log.type';
import type { Task } from '@/modules/tasks/types/task.type';
import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '@/modules/tasks/types/task.type';
import AvatarInitials from '@/shared/components/avatar-initials';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import dayjs from '@/shared/lib/dayjs';

interface Props {
  log: ActivityLog<Task>;
}

const statusText = {
  [TaskStatus.COMPLETED]: 'status.COMPLETED',
  [TaskStatus.IN_PROGRESS]: 'status.IN_PROGRESS',
  [TaskStatus.PENDING]: 'status.PENDING',
};

const priorityText = {
  [TaskPriority.HIGH]: 'priority.HIGH',
  [TaskPriority.MEDIUM]: 'priority.MEDIUM',
  [TaskPriority.LOW]: 'priority.LOW',
};

const categoryText = {
  [TaskCategory.WORK]: 'category.WORK',
  [TaskCategory.PERSONAL]: 'category.PERSONAL',
  [TaskCategory.LEARNING]: 'category.LEARNING',
  [TaskCategory.OTHER]: 'category.OTHER',
};

export default function TaskDetails({ log }: Props) {
  const { details } = log;
  const t = useTranslations('activityLogs.taskDetails');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{details.title}</h3>
              {details.description && (
                <p className="text-muted-foreground">{details.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Badge
                variant={
                  details.status === TaskStatus.COMPLETED
                    ? 'success'
                    : details.status === TaskStatus.IN_PROGRESS
                      ? 'info'
                      : 'outline'
                }
                className="flex items-center gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                {t(statusText[details.status])}
              </Badge>
              <Badge
                variant={
                  details.priority === TaskPriority.HIGH
                    ? 'error'
                    : details.priority === TaskPriority.MEDIUM
                      ? 'warning'
                      : 'success'
                }
                className="flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {t(priorityText[details.priority])}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-2">
              {details.category && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Folder className="h-4 w-4" />
                  <span>
                    {t('categoryColumn', {
                      category: t(categoryText[details.category]),
                    })}
                  </span>
                </div>
              )}

              {details.dueDate && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarClock className="h-4 w-4" />
                  <span>
                    {t('dueDateColumn', {
                      dueDate: dayjs(details.dueDate).format('DD/MM/YYYY'),
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-2">
              {details.assignedTo && (
                <div className="flex items-center gap-2">
                  <AvatarInitials
                    name={details.assignedTo.name}
                    src=""
                    alt={`${details.assignedTo.name}'s avatar`}
                    className="h-6 w-6"
                  />
                  <span className="text-muted-foreground text-sm">
                    {t('assignedToColumn', {
                      assignedTo: details.assignedTo.name,
                    })}
                  </span>
                </div>
              )}

              {details.createdBy && (
                <div className="flex items-center gap-2">
                  <AvatarInitials
                    name={details.createdBy.name}
                    src=""
                    alt={`${details.createdBy.name}'s avatar`}
                    className="h-6 w-6"
                  />
                  <span className="text-muted-foreground text-sm">
                    {t('createdByColumn', {
                      createdBy: details.createdBy.name,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 border-t pt-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              {log.action === ActivityLogActions.CREATE_TASK
                ? t('created')
                : log.action === ActivityLogActions.UPDATE_TASK
                  ? t('updated')
                  : t('deleted')}{' '}
              {t('date', {
                date: dayjs(log.createdAt).format('DD/MM/YYYY HH:mm'),
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
