import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useActiveFiltersCount() {
  const params = useSearchParams();

  return useMemo(() => {
    return [
      params.get('search'),
      params.get('action'),
      params.get('entityType'),
      params.get('dateFrom') || params.get('dateTo'),
      params.get('orderBy') || params.get('orderDir'),
      params.get('page'),
      params.get('limit'),
    ].filter(Boolean).length;
  }, [params]);
}
