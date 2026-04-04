'use client';

import { classNames } from '@kin/ui/utils';
import { type FunctionComponent, useId } from 'react';

type PropsType = {
  name: string;
  value: string;
  selected: string;
  setSelected: (value: string) => void;
  helper?: string;
};

export const Radio: FunctionComponent<PropsType> = ({
  name,
  value,
  helper,
  selected,
  setSelected,
}) => {
  const id = useId();

  return (
    <div className="flex flex-row flex-nowrap items-start justify-start gap-2">
      <div className="h-5 w-5 flex items-center justify-center shrink-0">
        <input
          id={id}
          type="radio"
          value={value}
          checked={selected === value}
          onChange={() => setSelected(value)}
          className={classNames(
            'w-4 h-4 rounded-full appearance-none cursor-pointer',
            'box-border border-5 border-stone-300 dark:border-stone-400 checked:border-blue-500 dark:checked:border-blue-600',
            'focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-700',
            'transition-color duration-300 ease-in-out',
          )}
        />
      </div>
      <div className="flex flex-col items-stretch justify-start gap-1">
        <label
          htmlFor={id}
          className="text-sm font-medium whitespace-nowrap leading-5"
        >
          {name}
        </label>
        {helper && (
          <p className="text-xs text-stone-600 dark:text-stone-400 whitespace-break-spaces">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
};
