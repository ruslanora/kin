'use client';

import { classNames } from '@kin/ui';
import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  value: string;
  selected: string;
  setSelected: (value: string) => void;
  children?: ReactNode;
};

export const TabItem: FunctionComponent<PropsType> = ({
  value,
  selected,
  setSelected,
  children,
}) => {
  return (
    <li className="inline-block">
      <button
        type="button"
        onClick={() => setSelected(value)}
        className={classNames(
          'px-3 cursor-pointer',
          'flex flex-col items-center justify-start shrink-0',
          'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 focus:z-10',
          'transition-300 duration-300 ease-in-out',
          value === selected
            ? 'text-stone-950 dark:text-stone-50 border-b-blue-500 dark:border-b-blue-6000'
            : 'text-stone-400 dark:text-stone-500 hover:text-stone-950 dark:hover:text-stone-50 border-b-stone-400 dark:border-b-stone-500 hover:border-b-stone-950 hover:dark:border-b-stone-50',
        )}
      >
        <div className="py-2.5 flex items-center justify-center shrink-0 flex-nowrap whitespace-nowrap">
          {children}
        </div>
        <span
          className={classNames(
            'block h-2 w-2 rounded-full',
            'transition-300 duration-300 ease-in-out',
            value === selected
              ? 'bg-blue-500 dark:bg-blue-600'
              : 'bg-transparent',
          )}
        />
      </button>
    </li>
  );
};

TabItem.displayName = 'Tab.Item';
