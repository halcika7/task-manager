import { AtSign, Clock, UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ActivityLog } from '@/modules/activity-logs/types/activity-log.type';
import type { User } from '@/modules/users/types/user.type';
import AvatarInitials from '@/shared/components/avatar-initials';
import { Card, CardContent } from '@/shared/components/ui/card';
import dayjs from '@/shared/lib/dayjs';
interface Props {
  log: ActivityLog<User>;
}

export default function UserDetails({ log }: Props) {
  const { details } = log;
  const t = useTranslations('activityLogs.userDetails');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <AvatarInitials
            name={details.name}
            src=""
            alt={`${details.name}'s avatar`}
            className="h-16 w-16"
          />

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <UserIcon className="h-4 w-4" />
                {details.name}
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-muted-foreground flex items-center gap-2">
                  <AtSign className="h-4 w-4" />
                  {details.email}
                </p>
              </div>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 border-t pt-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>
                {log.action === 'CREATE_USER'
                  ? t('created')
                  : log.action === 'UPDATE_USER'
                    ? t('updated')
                    : t('deleted')}{' '}
                {t('date', {
                  date: dayjs(log.createdAt).format('DD/MM/YYYY HH:mm'),
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
