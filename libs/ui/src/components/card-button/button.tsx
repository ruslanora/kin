'use client';

import { type FunctionComponent, type ReactNode, useId } from 'react';

import { classNames } from '../../utils';

type PropsType = {
  label?: string;
  isActive?: boolean;
  children?: ReactNode;
  onClick?: () => void;
};

export const CardButton: FunctionComponent<PropsType> = ({
  label,
  isActive,
  children,
  onClick,
}) => {
  const id = useId();

  return (
    <div className="flex flex-col items-center justify-center shrink-0 gap-2">
      <button
        id={id}
        type="button"
        onClick={onClick}
        className={classNames(
          'h-23.5 w-31.5 p-2 border rounded-xl cursor-pointer',
          'border-stone-200 dark:border-stone-900',
          'flex flex-col items-center justify-center shrink-0',
          'text-stone-600 bg-stone-100 hover:bg-stone-200',
          'dark:text-stone-500 dark:bg-stone-900 hover:dark:bg-stone-800',
          isActive && 'bg-stone-100! dark:bg-stone-800! border-blue-600!',
        )}
      >
        {children}
      </button>
      <label htmlFor={id} className="text-sm text-stone-950 dark:text-stone-50">
        {label}
      </label>
    </div>
  );
};
