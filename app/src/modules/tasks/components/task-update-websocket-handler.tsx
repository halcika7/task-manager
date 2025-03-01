'use client';

import { useTranslations } from 'next-intl';

import type { LocaleLinkProps } from '@/modules/i18n/routing';
import { LocaleLink, useLocaleRouter } from '@/modules/i18n/routing';
import useTaskUpdatedWebSocket from '@/modules/tasks/hooks/use-task-update-socket';

type Props = Readonly<{
  withRefresh?: boolean;
}>;

export default function TaskUpdateWebsocketHandler({
  withRefresh = false,
}: Props) {
  const t = useTranslations('taskWebsockets');
  const router = useLocaleRouter();

  useTaskUpdatedWebSocket(async data => {
    if (withRefresh) {
      router.refresh();
      return;
    }

    const sonner = await import('sonner');
    sonner.toast.success(
      <div className="flex flex-col gap-2">
        <p>{t('taskUpdated')}</p>
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
