'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';
import { useCallback } from 'react';

import { useActiveFiltersCount } from '@/modules/tasks/components/task-filter-modal/use-active-filters-count';
import {
  emptyTasksSearchParams,
  tasksSearchParams,
} from '@/modules/tasks/utils/search-tasks-params';
import { Button } from '@/shared/components/ui/button';

export default function ClearFiltersButton() {
  const [, setSearchParams] = useQueryStates(tasksSearchParams, {
    history: 'push',
    shallow: false,
  });
  const activeFiltersCount = useActiveFiltersCount();
  const t = useTranslations('tasks.filterModal');

  const clearFilters = useCallback(async () => {
    await setSearchParams(emptyTasksSearchParams);
  }, [setSearchParams]);

  if (activeFiltersCount === 0) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground h-9 px-2"
      onClick={clearFilters}
    >
      <X className="mr-2 h-4 w-4" />
      {t('clearFilters')}
    </Button>
  );
}
