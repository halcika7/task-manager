'use client';

import { Clock, Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useMemo } from 'react';
import type { ActivityLog } from '@/modules/activity-logs/types/activity-log.type';
import { ActivityLogActions } from '@/modules/activity-logs/types/activity-log.type';
import type { Comment } from '@/modules/comments/types/comment.type';
import type { Task } from '@/modules/tasks/types/task.type';
import AvatarInitials from '@/shared/components/avatar-initials';
import { Card, CardContent } from '@/shared/components/ui/card';
import dayjs from '@/shared/lib/dayjs';

interface Props {
  log: ActivityLog<{
    task: Task;
    comment: Comment;
  }>;
}

export default function CommentDetails({ log }: Props) {
  const { details } = log;
  const t = useTranslations('activityLogs.commentDetails');

  const date = useMemo(() => {
    if (log.action === ActivityLogActions.CREATE_COMMENT) {
      return log.details.comment.createdAt;
    }

    if (log.action === ActivityLogActions.UPDATE_COMMENT) {
      return log.details.comment.updatedAt;
    }

    return log.createdAt;
  }, [log]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Link2 className="size-4" />
              <span>{t('onTask', { taskTitle: details.task.title })}</span>
            </div>

            <div className="mt-4 flex items-start gap-3">
              {details.comment.user && (
                <AvatarInitials
                  name={details.comment.user.name}
                  src=""
                  alt={`${details.comment.user.name}'s avatar`}
                  className="h-8 w-8"
                />
              )}
              <div className="flex-1">
                <p className="text-sm">{details.comment.content}</p>
                {details.comment.updatedAt > details.comment.createdAt && (
                  <p className="text-muted-foreground mt-1 text-xs italic">
                    {t('edited')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 border-t pt-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              {log.action === ActivityLogActions.CREATE_COMMENT
                ? t('created')
                : log.action === ActivityLogActions.UPDATE_COMMENT
                  ? t('updated')
                  : t('deleted')}{' '}
              {t('date', {
                date: dayjs(date).format('DD/MM/YYYY HH:mm'),
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
