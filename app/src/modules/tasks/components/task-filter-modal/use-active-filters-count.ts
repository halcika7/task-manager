import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useActiveFiltersCount() {
  const params = useSearchParams();

  return useMemo(() => {
    let count = 0;

    if (params.get('page')) count++;
    if (params.get('limit')) count++;
    if (params.get('search')) count++;
    if (params.get('status')) count++;
    if (params.get('priority')) count++;
    if (params.get('category')) count++;
    if (params.get('assigneeId')) count++;
    if (params.get('createdById')) count++;
    if (params.get('dateFrom') || params.get('dateTo')) count++;
    if (params.get('orderBy') || params.get('orderDir')) count++;

    return count;
  }, [params]);
}
