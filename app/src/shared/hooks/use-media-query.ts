import { useContext } from 'react';

import { MediaQueryContext } from '@/shared/provider/media-query.provider';

function useMediaQuery() {
  const context = useContext(MediaQueryContext);

  if (context === undefined) {
    throw new Error('useMediaQuery must be used within a MediaQueryProvider');
  }

  return context;
}

export default useMediaQuery;
