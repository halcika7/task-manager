import type { CellContext } from '@tanstack/react-table';

import dayjs from '@/shared/lib/dayjs';
import { cn } from '@/shared/utils/cn';

type Props<T> = Readonly<
  CellContext<T, unknown> & { withTime?: boolean; className?: string }
>;

export default function DateCell<T>({
  getValue,
  withTime = true,
  className,
}: Props<T>) {
  return (
    <div className={cn('text-caption text-neutral-90 min-w-max', className)}>
      {dayjs
        .utc(getValue<string>())
        .tz(dayjs.tz.guess())
        .format(withTime ? 'MMM DD, YYYY hh:mm a' : 'MMM DD, YYYY')}
    </div>
  );
}
