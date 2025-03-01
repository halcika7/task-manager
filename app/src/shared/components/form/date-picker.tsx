'use client';

import { Portal } from '@radix-ui/react-portal';
import { CalendarIcon, XIcon } from 'lucide-react';
import type {
  KeyboardEvent,
  MouseEventHandler,
  MouseEvent as MouseEventReact,
  ReactNode,
} from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { DateRange, Modifiers, OnSelectHandler } from 'react-day-picker';
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import type { CalendarProps } from '@/shared/components/ui/calendar';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import useMediaQuery from '@/shared/hooks/use-media-query';
import dayjs from '@/shared/lib/dayjs';
import { cn } from '@/shared/utils/cn';

type Props<T extends FieldValues> = Readonly<
  Omit<CalendarProps, 'selected'> & {
    control: Control<T, undefined>;
    name: Path<T>;
    label?: string;
    mode: 'single' | 'range';
    className?: string;
    placeholder?: string;
    calendarClassName?: string;
    onValueChange?: (value: Date | DateRange | null) => void;
    clearable?: boolean;
    iconPosition?: 'left' | 'right';
    formatDateRange?: (from: string, to: string) => ReactNode;
  }
>;

export default function FormDatePicker<T extends FieldValues>({
  control,
  name,
  ...rest
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => <Field field={field} {...rest} />}
    />
  );
}

type FieldProps<T extends FieldValues> = Readonly<
  Omit<Props<T>, 'name' | 'control'> & {
    field: ControllerRenderProps<T, Path<T>>;
  }
>;

function Field<T extends FieldValues>({
  field,
  label,
  className,
  placeholder,
  mode,
  calendarClassName = '',
  onValueChange,
  clearable = false,
  iconPosition = 'left',
  formatDateRange,
  ...rest
}: FieldProps<T>) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useMediaQuery();

  const onSelectSingle: OnSelectHandler<Date> = useCallback(
    value => {
      field.onChange(value ?? null);
      onValueChange?.(value ?? null);

      setOpen(false);
    },
    [field, onValueChange]
  );

  const onSelectDateRange: OnSelectHandler<DateRange> = useCallback(
    value => {
      if (value === field.value) {
        field.onChange(null);
        onValueChange?.(null);
      } else {
        field.onChange(value ?? null);
        onValueChange?.(value ?? null);
      }

      if (value?.from?.getTime() !== value?.to?.getTime()) {
        setOpen(false);
      }
    },
    [field, onValueChange]
  );

  const onSelectHandler = useCallback(
    (
      value: unknown,
      selectedDate: Date,
      modifiers: Modifiers,
      e: MouseEventReact<Element, MouseEvent> | KeyboardEvent<Element>
    ) => {
      e.stopPropagation();
      e.preventDefault();

      if (mode === 'single') {
        return onSelectSingle(
          (value || selectedDate) as Date,
          selectedDate,
          modifiers,
          e
        );
      }
      return onSelectDateRange(value as DateRange, selectedDate, modifiers, e);
    },
    [mode, onSelectSingle, onSelectDateRange]
  );

  const formattedLabel = useMemo(() => {
    const value = field.value;

    if (!value) {
      return placeholder;
    }

    if (mode === 'range') {
      const { from, to } = value;

      if (!from || !to) {
        return placeholder;
      }

      if (formatDateRange) {
        return formatDateRange(
          dayjs(from).format('MM/DD/YYYY'),
          dayjs(to).format('MM/DD/YYYY')
        );
      }

      return `${dayjs(from).format('MM/DD/YYYY')} - ${dayjs(to).format('MM/DD/YYYY')}`;
    }
    return dayjs(value).format('MM/DD/YYYY');
  }, [field, mode, placeholder, formatDateRange]);

  const today = useMemo(() => {
    const value = field.value;

    if (!value) {
      return undefined;
    }

    if (mode === 'range') {
      const { from } = value;

      if (!from) {
        return undefined;
      }

      return dayjs(from).toDate();
    }

    return dayjs(value).toDate();
  }, [field, mode]);

  const closeDatePicker: MouseEventHandler<HTMLButtonElement> = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();
      setOpen(false);
    },
    [setOpen]
  );

  const onClear: MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();
      field.onChange(null);
      onValueChange?.(null);
    },
    [field, onValueChange]
  );

  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative w-full overflow-hidden rounded-sm">
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={cn(
                  'hover:bg-background hover:text-foreground h-9 w-full justify-start text-left font-normal',
                  !field.value && 'text-muted-foreground'
                )}
              >
                {iconPosition === 'left' && (
                  <CalendarIcon className="mr-2 size-4 shrink-0" />
                )}
                {formattedLabel}
                {((clearable && field.value) || iconPosition === 'right') && (
                  <div className="flex items-center gap-1">
                    {clearable && field.value && (
                      <div
                        onClick={onClear}
                        className="ml-auto flex justify-self-end"
                        role="presentation"
                      >
                        <XIcon className="size-5" />
                      </div>
                    )}
                    {iconPosition === 'right' && (
                      <CalendarIcon className="ml-2 size-4 shrink-0" />
                    )}
                  </div>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
        </div>
        <Portal
          className={cn(
            'w-full overflow-hidden rounded-sm',
            isMobile &&
              'max-sm:[&_[data-radix-popper-content-wrapper]]:!fixed max-sm:[&_[data-radix-popper-content-wrapper]]:!inset-0 max-sm:[&_[data-radix-popper-content-wrapper]]:!top-0 max-sm:[&_[data-radix-popper-content-wrapper]]:!right-0 max-sm:[&_[data-radix-popper-content-wrapper]]:!bottom-0 max-sm:[&_[data-radix-popper-content-wrapper]]:!left-0 max-sm:[&_[data-radix-popper-content-wrapper]]:!h-screen max-sm:[&_[data-radix-popper-content-wrapper]]:!w-screen max-sm:[&_[data-radix-popper-content-wrapper]]:!max-w-none max-sm:[&_[data-radix-popper-content-wrapper]]:!transform-none'
          )}
        >
          <PopoverContent
            className={cn(
              'w-full p-0',
              isMobile &&
                'max-sm:data-[state=open]:zoom-in-100 border-none max-sm:bottom-0 max-sm:h-dvh max-sm:rounded-none'
            )}
            align="start"
            withPortal={false}
          >
            {isMobile && (
              <Button
                variant="ghost"
                onClick={closeDatePicker}
                className="ml-auto flex justify-self-end sm:hidden"
                size="sm"
              >
                <XIcon className="size-5" />
              </Button>
            )}
            <Calendar
              {...rest}
              className={cn(
                'max-h-screen overflow-y-auto sm:rounded-md sm:border sm:shadow-md',
                calendarClassName
              )}
              mode={mode}
              selected={field.value}
              onSelect={onSelectHandler}
              today={today}
              fullScreen={isMobile}
            />
          </PopoverContent>
        </Portal>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
