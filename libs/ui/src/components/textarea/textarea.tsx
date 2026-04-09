'use client';

import { classNames } from '@kin/ui';
import type { FunctionComponent } from 'react';

type PropsType = {
  placeholder?: string;
  width?: 'full' | 'fixed';
  rows?: number;
  value: string;
  setValue: (value: string) => void;
  onBlur?: () => void;
};

export const Textarea: FunctionComponent<PropsType> = ({
  placeholder,
  width = 'full',
  rows = 5,
  value,
  setValue,
  onBlur,
}) => {
  return (
    <textarea
      className={classNames(
        'block w-full p-3',
        width === 'fixed' && 'max-w-sm',
        'text-sm font-medium text-stone-950 dark:text-stone-50',
        'border rounded-xl shadow-xs',
        'transition-all duration-300 ease-in-out',
        'bg-stone-50 dark:bg-stone-950',
        'border-stone-200 dark:border-stone-800',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
      )}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={onBlur}
    />
  );
};
