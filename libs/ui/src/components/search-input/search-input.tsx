'use client';

import { classNames } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

type PropsType = {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
};

export const SearchInput: FunctionComponent<PropsType> = ({
  placeholder = 'Search',
  value,
  setValue,
}) => {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-stone-400 dark:text-stone-500 pointer-events-none">
        <FiSearch size={14} />
      </span>
      <input
        type="text"
        className={classNames(
          'block w-full h-10 pl-8 pr-8',
          'text-sm font-medium text-stone-950 dark:text-stone-50',
          'border rounded-xl shadow-xs',
          'transition-all duration-300 ease-in-out',
          'bg-stone-50 dark:bg-stone-950',
          'border-stone-200 dark:border-stone-800',
          'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
        )}
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute right-3 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors"
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
};
