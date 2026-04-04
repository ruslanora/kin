'use client';

import { classNames } from '@kin/ui/utils';
import type { FunctionComponent } from 'react';

type PropsType = {
  type?: 'text' | 'number';
  placeholder?: string;
  width?: 'full' | 'fixed';
  value: string;
  setValue: (value: string) => void;
  onBlur?: () => void;
};

export const TextInput: FunctionComponent<PropsType> = ({
  type = 'text',
  placeholder,
  width = 'full',
  value,
  setValue,
  onBlur,
}) => {
  return (
    <input
      type={type}
      className={classNames(
        'w-full h-9 px-3',
        width === 'fixed' && 'max-w-sm',
        'text-sm font-medium',
        'inline-block border rounded-lg shadow-xs',
        'transition-all duration-300 ease-in-out',
        'bg-transparent border-stone-200',
        'dark:bg-transparent dark:border-stone-800',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
      )}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={onBlur}
    />
  );
};
