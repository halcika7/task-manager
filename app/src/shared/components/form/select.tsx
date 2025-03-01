'use client';

import type { SelectProps } from '@radix-ui/react-select';
import { XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { MouseEventHandler, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/utils/cn';

type Props<T extends FieldValues> = Readonly<
  SelectProps & {
    control: Control<T, undefined>;
    name: Path<T>;
    label?: string;
    className?: string;
    placeholder?: string;
    options: { label: string | ReactNode; value: string | number }[];
    clearable?: boolean;
    triggerClassName?: string;
    selectItemClassName?: string;
    description?: string;
  }
>;

export default function FormSelect<T extends FieldValues>({
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
  options,
  clearable = false,
  onValueChange,
  triggerClassName,
  selectItemClassName,
  description,
  ...rest
}: FieldProps<T>) {
  const t = useTranslations();

  const onClear: MouseEventHandler<HTMLButtonElement> = useCallback(
    e => {
      e.stopPropagation();
      onValueChange?.('');
      field.onChange(null);
      field.onBlur();
    },
    [field, onValueChange]
  );

  const onChange = useCallback(
    (value: string) => {
      if (!value) {
        onValueChange?.('');
        return field.onChange(null);
      }
      onValueChange?.(value);
      field.onChange(value);
    },
    [field, onValueChange]
  );

  const selectedValue = useMemo(() => {
    return options.find(option => option.value === field.value)?.label;
  }, [field.value, options]);

  return (
    <FormItem className={className}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <Select
        {...rest}
        value={field.value ? field.value.toString() : null}
        onValueChange={onChange}
      >
        <FormControl>
          <div className="relative w-full overflow-hidden rounded-sm">
            <SelectTrigger className={cn('h-9', triggerClassName)}>
              <SelectValue placeholder={placeholder}>
                {selectedValue ? t(selectedValue) : placeholder}
              </SelectValue>
            </SelectTrigger>
            {clearable && field.value ? (
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="absolute top-1/2 right-10 z-10 -translate-y-1/2 border-none bg-transparent"
                onClick={onClear}
              >
                <XIcon className="size-5" />
              </Button>
            ) : null}
          </div>
        </FormControl>
        <SelectContent side="bottom" align="end" className="max-h-[200px]">
          {options.map(option => (
            <SelectItem
              key={option.value}
              value={option.value?.toString()}
              className={cn(
                'hover:bg-blue-10 hover:text-blue-50',
                selectItemClassName
              )}
            >
              {t(option.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
