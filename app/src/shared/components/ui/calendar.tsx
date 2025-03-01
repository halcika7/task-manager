'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import type { Locale } from 'react-day-picker';
import { DayPicker } from 'react-day-picker';

import { Button, buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  fullScreen?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fullScreen,
  ...props
}: CalendarProps) {
  const userLocale = useLocale();
  const [locale, setLocale] = useState<Locale>();

  useEffect(() => {
    async function loadLocale() {
      const locales = await import(`react-day-picker/locale`);
      setLocale(locales[userLocale as keyof typeof locales]);
    }

    void loadLocale();
  }, [userLocale]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        root: 'h-full w-screen sm:w-full sm:h-auto',
        months: cn('flex flex-col sm:flex-row space-y-3 relative', {
          'sm:space-y-0 sm:gap-x-3': props.mode === 'range',
        }),
        month: 'space-y-4',
        month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium capitalize',
        nav: 'space-x-1 flex items-center absolute w-full top-0',
        button_previous: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-7 bg-transparent p-0 absolute top-0 left-1 z-10 text-neutral-90 border-none disabled:opacity-50',
          'focus-within:bg-accent focus:bg-accent focus-visible:bg-accent',
          'focus-within:text-neutral-90 focus:text-neutral-90 focus-visible:text-neutral-90',
          { 'sm:top-0': props.mode === 'range' }
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-7 bg-transparent p-0 absolute top-0 right-1 z-10 text-neutral-90 border-none disabled:opacity-50',
          'focus-within:bg-accent focus:bg-accent focus-visible:bg-accent',
          'focus-within:text-neutral-90 focus:text-neutral-90 focus-visible:text-neutral-90',
          { 'sm:top-0': props.mode === 'range' }
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: cn('flex', fullScreen && 'max-sm:w-full'),
        weekday: cn(
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
          fullScreen && 'max-sm:w-full'
        ),
        week: cn('flex w-full mt-2', fullScreen && 'max-sm:w-full'),
        day: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50',
          props.mode === 'range'
            ? '[&:has(.day-range-end)]:rounded-r-md [&:has(.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
          fullScreen && 'max-sm:w-full'
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100',
          fullScreen && 'max-sm:w-full'
        ),
        range_start:
          'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
        range_end:
          'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside: cn(
          'day-outside text-muted-foreground opacity-50 aria-selected:text-muted-foreground aria-selected:!bg-muted aria-selected:hover:!bg-muted',
          '[&>button]:hover:bg-muted [&>button]:hover:text-muted-foreground [&:has([aria-selected])]:bg-muted [&:has([aria-selected])]:text-muted-foreground',
          '[&:has([aria-selected])]:hover:text-muted-foreground [&>button]:!pointer-events-none'
        ),
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      locale={locale}
      components={{
        NextMonthButton: ({ className, ...props }) => (
          <Button
            variant="outline"
            size="icon"
            className={cn('size-7', className)}
            {...props}
          >
            <ChevronRight className="size-4" />
          </Button>
        ),
        PreviousMonthButton: ({ className, ...props }) => (
          <Button
            variant="outline"
            size="icon"
            className={cn('size-7', className)}
            {...props}
          >
            <ChevronLeft className="size-4" />
          </Button>
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
