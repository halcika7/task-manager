import type { HeaderContext } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

type Props<T> = Readonly<
  HeaderContext<T, unknown> & {
    title: string;
    isSortingEnabled?: boolean;
    className?: string;
  }
>;

const icons = {
  asc: <ArrowUpIcon className="size-4" />,
  desc: <ArrowDownIcon className="size-4" />,
  false: null,
} as const;

function SortableColumn<T>({
  column,
  title,
  isSortingEnabled = true,
  className,
}: Props<T>) {
  const icon = icons[`${column.getIsSorted()}`];
  const t = useTranslations();

  return (
    <Button
      variant="ghost"
      onClick={isSortingEnabled ? column.getToggleSortingHandler() : undefined}
      className={cn(
        'min-w-max !px-0 text-sm font-normal text-neutral-600 hover:bg-transparent dark:text-neutral-100',
        className,
        {
          'pointer-events-none cursor-not-allowed': !isSortingEnabled,
        }
      )}
    >
      {title ? t(title) : null}
      {isSortingEnabled && icon}
    </Button>
  );
}

export default SortableColumn;
