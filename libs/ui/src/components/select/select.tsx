'use client';

import { classNames } from '@kin/ui/utils';
import { type FunctionComponent, useId } from 'react';

type OptionType = {
  name: string;
  value: string | number;
};

type PropsType = {
  placeholder?: string;
  selected: string | number | null | undefined;
  setSelected: (selected: string | number | null | undefined) => void;
  options: Array<OptionType>;
};

export const Select: FunctionComponent<PropsType> = ({
  placeholder,
  selected,
  setSelected,
  options,
}) => {
  const id = useId();

  return (
    <select
      id={id}
      value={selected ?? ''}
      onChange={(e) => setSelected(e.target.value)}
      className={classNames(
        'inline-block h-9 w-full border rounded-lg shadow-xs cursor-pointer',
        'text-sm font-medium px-4',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
        'bg-transparent border-stone-200',
        'dark:bg-transparent dark:border-stone-800',
      )}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={`${id}-${option.value}`} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};
