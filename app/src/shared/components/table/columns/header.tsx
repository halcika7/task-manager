import type { HeaderContext } from '@tanstack/react-table';
import { useMemo } from 'react';

import SortableColumn from '@/shared/components/table/columns/sortable-column';

type Props<T> = Readonly<
  HeaderContext<T, unknown> & {
    title: string;
    isSortingEnabled?: boolean;
    className?: string;
  }
>;

function Header<T>({ title, isSortingEnabled = true, ...props }: Props<T>) {
  const totalRows = useMemo(() => {
    return props.table.getRowCount();
  }, [props.table]);

  return (
    <SortableColumn
      {...props}
      isSortingEnabled={totalRows <= 0 ? false : isSortingEnabled}
      title={title}
    />
  );
}

export default Header;
