'use client';

import { SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { useActiveFiltersCount } from '@/modules/tasks/components/task-filter-modal/use-active-filters-count';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

const TaskFilterModal = dynamic(
  () => import('./index').then(mod => mod.TaskFilterModal),
  { ssr: false }
);

export default function TaskFilterModalTrigger() {
  const [open, setOpen] = useState(false);
  const activeFiltersCount = useActiveFiltersCount();
  const t = useTranslations('tasks.filterModal');

  const toggleOpen = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hover:border-border relative h-9 border-dashed font-medium shadow-sm transition-all hover:border-solid"
        onClick={toggleOpen}
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        {t('filters')}
        {activeFiltersCount > 0 && (
          <Badge
            variant="secondary"
            className="ml-2 h-5 min-w-5 rounded-full border-none px-1.5 font-mono text-xs"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
      {open && <TaskFilterModal open={open} onClose={toggleOpen} />}
    </>
  );
}
