import { useMemo } from 'react';

type Props = Readonly<{
  currentPage: number;
  numberOfPages: number;
  perPage: number;
  rowCount?: number;
}>;

function PaginationText({
  currentPage,
  numberOfPages,
  perPage,
  rowCount,
}: Props) {
  const data = useMemo(() => {
    const totalItems = rowCount || numberOfPages * perPage;
    let currentPageItems = currentPage * perPage;
    const from = currentPageItems - perPage || 1;

    if (currentPage === numberOfPages) {
      currentPageItems = totalItems;
    }

    return {
      totalItems,
      currentPageItems,
      from,
    };
  }, [numberOfPages, currentPage, perPage, rowCount]);
  return (
    <span className="text-foreground min-w-max text-sm">
      {`${data.from} - ${data.currentPageItems} of ${data.totalItems}`}
    </span>
  );
}

export default PaginationText;
