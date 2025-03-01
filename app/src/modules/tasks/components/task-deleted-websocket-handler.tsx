'use client';

import { useTranslations } from 'next-intl';

import { useLocaleRouter } from '@/modules/i18n/routing';
import useTaskDeletedWebSocket from '@/modules/tasks/hooks/use-task-deleted-socket';

type Props = Readonly<{
  withRedirect?: boolean;
}>;

export default function TaskDeletedWebsocketHandler({
  withRedirect = false,
}: Props) {
  const t = useTranslations('taskWebsockets');
  const router = useLocaleRouter();

  useTaskDeletedWebSocket(async data => {
    if (withRedirect) {
      router.replace('/dashboard');
      return;
    }

    const sonner = await import('sonner');
    sonner.toast.error(
      <div className="flex flex-col gap-2">
        <p>{t('taskDeleted')}</p>
        <p>{data.title}</p>
      </div>,
      { duration: 5000 }
    );
  });

  return null;
}
