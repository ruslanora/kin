'use client';

import { classNames } from '@kin/ui';
import { type FunctionComponent, useId, useState } from 'react';

type OptionType = {
  name: string;
  value: string | number;
};

type PropsType = {
  label?: string;
  placeholder?: string;
  selected: string | number | null | undefined;
  setSelected: (selected: string | number | null | undefined) => void;
  options: Array<OptionType>;
};

export const Select: FunctionComponent<PropsType> = ({
  label,
  placeholder,
  selected,
  setSelected,
  options,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();

  const floated =
    isFocused ||
    (selected !== null && selected !== undefined && selected !== '');

  return (
    <div className="relative">
      <select
        id={id}
        value={selected ?? ''}
        onChange={(e) => setSelected(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={classNames(
          'block w-full h-10 px-3',
          'text-sm font-medium text-stone-950 dark:text-stone-50',
          'bg-stone-50 dark:bg-stone-950',
          'border rounded-xl shadow-xs border-stone-200 dark:border-stone-800',
          'focus:outline-none',
          'transition-all duration-300 ease-in-out cursor-pointer',
          isFocused && 'ring-4 ring-blue-300 dark:ring-blue-700',
        )}
      >
        {(placeholder ?? label) && (
          <option value="" disabled hidden>
            {placeholder ?? label}
          </option>
        )}
        {options.map((option) => (
          <option key={`${id}-${option.value}`} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      {label && (
        <label
          htmlFor={id}
          className={classNames(
            'absolute z-10 origin-left inset-s-1 px-2 pointer-events-none',
            'text-sm transform transition-all duration-300',
            floated
              ? '-translate-y-4 scale-75 top-2 bg-stone-50 dark:bg-stone-950'
              : 'scale-100 top-1/2 -translate-y-1/2',
            isFocused
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-stone-500 dark:text-stone-400',
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};
