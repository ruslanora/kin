'use client';

import { classNames } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { Icon } from '../icon/icon';

type PropsType = {
  icon: string;
  active?: boolean;
  size?: 'sm' | 'md';
  onClick: () => void;
};

export const IconButton: FunctionComponent<PropsType> = ({
  icon,
  size = 'md',
  active,
  onClick,
}) => (
  <button
    type="button"
    className={classNames(
      size === 'sm' && 'h-8 w-8 rounded-lg',
      size === 'md' && 'h-10 w-10 rounded-xl',
      'flex items-center justify-center shrink-0',
      'transition-all duration-300 ease-in-out',
      'cursor-pointer',
      'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
      active
        ? 'text-stone-900 bg-stone-200 dark:text-stone-100 dark:bg-stone-700'
        : 'text-stone-400 bg-transparent hover:text-stone-500 hover:bg-stone-200 dark:text-stone-500 dark:hover:text-stone-400 dark:hover:bg-stone-800',
    )}
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
  >
    <Icon name={icon} size={18} />
  </button>
);
