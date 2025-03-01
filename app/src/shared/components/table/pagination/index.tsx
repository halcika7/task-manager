import { useTranslations } from 'next-intl';
import type { MouseEventHandler } from 'react';
import { useCallback } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

type Props = Readonly<{
  canGoNext: boolean;
  canGoPrev: boolean;
  currentPage: number;
  numberOfPages: number;
  goTo: (_: number) => void;
  onPageHoverPrefetch: (_: number) => void;
}>;

function TablePagination({
  currentPage,
  numberOfPages,
  canGoPrev,
  canGoNext,
  goTo,
  onPageHoverPrefetch,
}: Props) {
  const t = useTranslations('table');

  const onClick = useCallback(
    (index: number): MouseEventHandler<HTMLAnchorElement> =>
      e => {
        e.preventDefault();
        e.stopPropagation();
        const disabled = e.currentTarget.getAttribute('disabled');
        if (!disabled) {
          goTo(index);
        }
      },
    [goTo]
  );

  const onPageHover = useCallback(
    (index: number): MouseEventHandler<HTMLAnchorElement> =>
      e => {
        const disabled = e.currentTarget.getAttribute('disabled');
        if (!disabled) {
          onPageHoverPrefetch(index);
        }
      },
    [onPageHoverPrefetch]
  );

  if (numberOfPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <PaginationItem aria-disabled={canGoPrev}>
              <PaginationPrevious
                onClick={canGoPrev ? undefined : onClick(currentPage - 1)}
                className="size-8 disabled:cursor-not-allowed"
                size="icon"
                onMouseEnter={onPageHover(currentPage - 1)}
              />
            </PaginationItem>
          </TooltipTrigger>
          {!canGoPrev && <TooltipContent>{t('previous')}</TooltipContent>}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <PaginationItem aria-disabled={canGoNext}>
              <PaginationNext
                onClick={canGoNext ? undefined : onClick(currentPage + 1)}
                className="size-8 disabled:cursor-not-allowed"
                size="icon"
                onMouseEnter={onPageHover(currentPage + 1)}
              />
            </PaginationItem>
          </TooltipTrigger>
          {!canGoNext && <TooltipContent>{t('next')}</TooltipContent>}
        </Tooltip>
      </PaginationContent>
    </Pagination>
  );
}

export default TablePagination;
