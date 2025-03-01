'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { useActiveFiltersCount } from '@/modules/users/components/user-filter-modal/use-active-filters-count';
import { useUserAction } from '@/modules/users/context/user-action.context';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Action } from '@/shared/provider/action.provider';

export default function UserFilterModalTrigger() {
  const { setAction } = useUserAction();
  const activeFiltersCount = useActiveFiltersCount();
  const t = useTranslations('users.filterModal');

  const handleClick = useCallback(() => {
    setAction(Action.FILTERS);
  }, [setAction]);

  return (
    <Button
      variant="outline"
      size="sm"
      className="hover:border-border relative h-9 border-dashed font-medium shadow-sm transition-all hover:border-solid"
      onClick={handleClick}
    >
      <SlidersHorizontal className="mr-2 h-4 w-4" />
      {t('trigger')}
      {activeFiltersCount > 0 && (
        <Badge
          variant="secondary"
          className="ml-2 h-5 min-w-5 rounded-full border-none px-1.5 font-mono text-xs"
        >
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  );
}
