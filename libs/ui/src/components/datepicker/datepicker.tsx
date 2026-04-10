'use client';

import { classNames } from '@kin/ui';
import type { FunctionComponent } from 'react';

type PropsType = {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  onBlur?: () => void;
  type?: 'date' | 'month';
};

export const DatePicker: FunctionComponent<PropsType> = ({
  placeholder,
  value,
  setValue,
  onBlur,
  type = 'date',
}) => {
  return (
    <input
      type={type}
      className={classNames(
        'block w-full h-10 px-3',
        'text-sm font-medium text-stone-950 dark:text-stone-50',
        'border rounded-xl shadow-xs',
        'transition-all duration-300 ease-in-out',
        'bg-stone-50 dark:bg-stone-950',
        'border-stone-200 dark:border-stone-800',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
        'scheme-light dark:scheme-dark',
      )}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={onBlur}
    />
  );
};
