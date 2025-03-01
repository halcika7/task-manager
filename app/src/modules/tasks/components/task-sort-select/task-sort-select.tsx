'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';
import type { MouseEventHandler } from 'react';
import { useCallback, useMemo } from 'react';

import { tasksSearchParams } from '@/modules/tasks/utils/search-tasks-params';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export default function TaskSortSelect() {
  const [searchParams, setSearchParams] = useQueryStates(tasksSearchParams, {
    history: 'push',
    shallow: false,
  });
  const t = useTranslations('tasks.filterModal.sort');

  const currentValue = useMemo(() => {
    const orderBy = searchParams.orderBy;
    const orderDir = searchParams.orderDir;
    if (!orderBy || !orderDir) {
      return t('placeholder');
    }
    return t(`${orderBy}.${orderDir}`);
  }, [searchParams, t]);

  const handleSortChange: MouseEventHandler<HTMLDivElement> = useCallback(
    async event => {
      const { sort } = event.currentTarget.dataset;
      if (!sort) {
        return null;
      }
      const [orderBy, orderDir] = sort.split(':');
      await setSearchParams({ orderBy, orderDir });
    },
    [setSearchParams]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-40">
          {currentValue}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleSortChange} data-sort="dueDate:desc">
          {t('dueDate.desc')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSortChange} data-sort="dueDate:asc">
          {t('dueDate.asc')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSortChange} data-sort="createdAt:desc">
          {t('createdAt.desc')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSortChange} data-sort="createdAt:asc">
          {t('createdAt.asc')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
