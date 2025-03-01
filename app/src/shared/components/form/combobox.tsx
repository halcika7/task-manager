import type {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import type { Command as CommandPrimitive } from 'cmdk';
import { CommandLoading } from 'cmdk';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import type {
  ComponentPropsWithoutRef,
  ReactNode,
  UIEventHandler,
} from 'react';
import { useCallback, useMemo, useState } from 'react';
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import type { HttpClientResponse } from '@/shared/lib/http-client';
import { cn } from '@/shared/utils/cn';

type Props<T extends FieldValues, K> = Readonly<
  ComponentPropsWithoutRef<typeof CommandPrimitive> & {
    control: Control<T, undefined>;
    name: Path<T>;
    label?: string;
    className?: string;
    placeholder?: string;
    options: { label: string | ReactNode; value: string | number }[];
    loadMore?: (
      options?: FetchNextPageOptions
    ) => Promise<
      InfiniteQueryObserverResult<
        InfiniteData<HttpClientResponse<K> | null, unknown>,
        Error
      >
    >;
    isLoading?: boolean;
    emptyMessage?: string;
    disabled?: boolean;
  }
>;

export default function FormCombobox<T extends FieldValues, K>({
  control,
  name,
  ...rest
}: Props<T, K>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => <Field field={field} {...rest} />}
    />
  );
}

type FieldProps<T extends FieldValues, K> = Readonly<
  Omit<Props<T, K>, 'name' | 'control'> & {
    field: ControllerRenderProps<T, Path<T>>;
  }
>;

function Field<T extends FieldValues, K>({
  field,
  label,
  className,
  placeholder,
  options,
  loadMore,
  isLoading,
  emptyMessage,
  disabled = false,
  ...rest
}: FieldProps<T, K>) {
  const [isOpen, setIsOpen] = useState(false);

  const checkScrollPosition: UIEventHandler<HTMLDivElement> = useCallback(
    event => {
      const scrollContainer = event.currentTarget;

      if (scrollContainer && loadMore) {
        const isAtBottom =
          scrollContainer.scrollHeight - scrollContainer.scrollTop ===
          scrollContainer.clientHeight;

        if (isAtBottom) {
          loadMore();
        }
      }
    },
    [loadMore]
  );

  const onSelect = useCallback(
    (value: string | number) => () => {
      field.onChange(value);
      setIsOpen(false);
    },
    [field]
  );

  const getSelectedLabels = useMemo(() => {
    if (!field.value) return placeholder;

    return (
      options.find(option => option.value === field.value)?.label || placeholder
    );
  }, [field.value, options, placeholder]);

  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <div className="relative w-full overflow-hidden rounded-sm">
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              variant="outline"
              className={cn(
                'hover:bg-background hover:text-foreground h-9 w-full justify-start text-left font-normal',
                "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span]:line-clamp-1",
                !field.value && 'text-muted-foreground'
              )}
            >
              {getSelectedLabels}
              <ChevronDownIcon className="ml-auto size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className="w-full p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command {...rest}>
            <CommandList>
              <CommandEmpty>
                {emptyMessage || 'No framework found.'}
              </CommandEmpty>
              <CommandGroup>
                <ScrollArea
                  className="h-36"
                  onScrollCapture={loadMore ? checkScrollPosition : undefined}
                >
                  {options.map(option => (
                    <CommandItem
                      value={option.value.toString()}
                      key={option.value}
                      onSelect={onSelect(option.value)}
                    >
                      {option.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto size-4',
                          option.value === field.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                  {isLoading && (
                    <CommandLoading className="flex items-center justify-center">
                      <LoadingSpinner />
                    </CommandLoading>
                  )}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
