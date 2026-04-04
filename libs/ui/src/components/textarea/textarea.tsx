'use client';

import { classNames } from '@kin/ui/utils';
import type { FunctionComponent } from 'react';

type PropsType = {
  placeholder?: string;
  width?: 'full' | 'fixed';
  rows?: number;
  value: string;
  setValue: (value: string) => void;
};

export const Textarea: FunctionComponent<PropsType> = ({
  placeholder,
  width = 'full',
  rows = 5,
  value,
  setValue,
}) => {
  return (
    <textarea
      className={classNames(
        'w-full p-3',
        width === 'fixed' && 'max-w-sm',
        'text-sm font-medium',
        'inline-block border rounded-lg shadow-xs',
        'transition-all duration-300 ease-in-out',
        'bg-transparent hover:bg-stone-200 border-stone-200',
        'dark:bg-transparent hover:dark:bg-stone-800 dark:border-stone-800',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
      )}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
};
