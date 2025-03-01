'use client';

import { SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { useActiveFiltersCount } from '@/modules/activity-logs/components/activity-log-filter-modal/use-active-filters-count';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

const ActivityLogFilterModal = dynamic(
  () =>
    import('@/modules/activity-logs/components/activity-log-filter-modal').then(
      mod => mod.ActivityLogFilterModal
    ),
  { ssr: false }
);

export default function ActivityLogFilterModalTrigger() {
  const [open, setOpen] = useState(false);
  const activeFiltersCount = useActiveFiltersCount();
  const t = useTranslations('activityLogs.filterModal');

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
        <SlidersHorizontal className="mr-2 size-4" />
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
      {open && <ActivityLogFilterModal open={open} onClose={toggleOpen} />}
    </>
  );
}
