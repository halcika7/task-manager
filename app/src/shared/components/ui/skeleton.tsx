import type { ComponentProps } from 'react';
import { cn } from '@/shared/utils/cn';

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-primary/10 animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
