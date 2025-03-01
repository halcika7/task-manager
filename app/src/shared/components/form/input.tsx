'use client';

import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
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
import { Input } from '@/shared/components/ui/input';

type Props<T extends FieldValues> = Readonly<
  InputHTMLAttributes<HTMLInputElement> & {
    control: Control<T, undefined>;
    name: Path<T>;
    label?: string;
    className?: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    description?: string;
  }
>;

export default function FormInput<T extends FieldValues>({
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
  type,
  description,
  ...rest
}: FieldProps<T>) {
  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Input placeholder={placeholder} type={type} {...rest} {...field} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
