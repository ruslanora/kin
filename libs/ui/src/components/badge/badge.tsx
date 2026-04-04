'use client';

import type { FunctionComponent, ReactNode } from 'react';

import { classNames } from '../../utils';

type PropsType = {
  variant?: 'brand' | 'gray' | 'danger' | 'success' | 'warning';
  children?: ReactNode;
};

export const Badge: FunctionComponent<PropsType> = ({
  variant = 'brand',
  children,
}) => (
  <div
    className={classNames(
      'text-sm font-medium px-1.5 py-0.5 rounded-full',
      variant === 'brand' && 'text-blue-800 bg-blue-200',
      variant === 'gray' &&
        'text-stone-800 bg-stone-200 dark:text-stone-200 dark:bg-stone-800',
      variant === 'danger' && 'text-rose-800 bg-rose-200',
      variant === 'success' && 'text-green-800 bg-green-200',
      variant === 'warning' && 'text-yellow-800 bg-yellow-200',
    )}
  >
    {children}
  </div>
);
