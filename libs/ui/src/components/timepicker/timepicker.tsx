'use client';

import { classNames } from '@kin/ui/utils';
import type { FunctionComponent } from 'react';

type PropsType = {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  onBlur?: () => void;
};

export const TimePicker: FunctionComponent<PropsType> = ({
  placeholder,
  value,
  setValue,
  onBlur,
}) => {
  return (
    <input
      type="time"
      className={classNames(
        'w-full h-9 px-3',
        'text-sm font-medium',
        'inline-block border rounded-lg shadow-xs',
        'transition-all duration-300 ease-in-out',
        'bg-transparent border-stone-200',
        'dark:bg-transparent dark:border-stone-800',
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
