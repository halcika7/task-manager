'use client';

import { useTranslations } from 'next-intl';

import type { LocaleLinkProps } from '@/modules/i18n/routing';
import { LocaleLink } from '@/modules/i18n/routing';
import useTaskReminderWebSocket from '@/modules/tasks/hooks/use-task-reminder.socket';

type Props = Readonly<{
  withLink?: boolean;
}>;

export default function TaskReminderWebsocketHandler({
  withLink = true,
}: Props) {
  const t = useTranslations('taskWebsockets');

  useTaskReminderWebSocket(async data => {
    const sonner = await import('sonner');
    sonner.toast.warning(
      <div className="flex flex-col gap-2">
        <p>{t('taskReminder')}</p>
        <p>{data.title}</p>
        <p>{t('hoursUntilDue', { hours: data.hoursUntilDue })}</p>
        {withLink && (
          <LocaleLink href={`/dashboard/${data.id}` as LocaleLinkProps['href']}>
            {t('viewTask')}
          </LocaleLink>
        )}
      </div>,
      { duration: 10000 }
    );
  });

  return null;
}
