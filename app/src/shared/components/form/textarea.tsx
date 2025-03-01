'use client';

import type { TextareaHTMLAttributes } from 'react';
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';

type Props<T extends FieldValues> = Readonly<
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    control: Control<T, undefined>;
    name: Path<T>;
    label?: string;
    className?: string;
    placeholder?: string;
    description?: string;
  }
>;

export default function FormTextarea<T extends FieldValues>({
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
  description,
  ...rest
}: FieldProps<T>) {
  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Textarea placeholder={placeholder} {...rest} {...field} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
