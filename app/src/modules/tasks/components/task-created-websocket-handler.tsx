'use client';

import { useTranslations } from 'next-intl';

import type { LocaleLinkProps } from '@/modules/i18n/routing';
import { LocaleLink } from '@/modules/i18n/routing';
import useTaskCreatedWebSocket from '@/modules/tasks/hooks/use-task-created-socket';

export default function TaskCreatedWebsocketHandler() {
  const t = useTranslations('taskWebsockets');

  useTaskCreatedWebSocket(async data => {
    const sonner = await import('sonner');
    sonner.toast.success(
      <div className="flex flex-col gap-2">
        <p>{t('taskCreated')}</p>
        <p>{data.title}</p>
        <LocaleLink href={`/dashboard/${data.id}` as LocaleLinkProps['href']}>
          {t('viewTask')}
        </LocaleLink>
      </div>,
      { duration: 10000 }
    );
  });

  return null;
}
