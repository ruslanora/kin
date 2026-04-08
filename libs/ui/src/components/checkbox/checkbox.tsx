'use client';

import { classNames } from '@kin/ui';
import { type FunctionComponent, useId } from 'react';

type PropsType = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helper?: string;
  disabled?: boolean;
};

export const Checkbox: FunctionComponent<PropsType> = ({
  label,
  checked,
  onChange,
  helper,
  disabled,
}) => {
  const id = useId();

  return (
    <div className="flex flex-row flex-nowrap items-start justify-start gap-2">
      <div className="h-5 w-5 flex items-center justify-center shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className={classNames(
            'w-4 h-4 rounded-md appearance-none cursor-pointer',
            'box-border border-2 border-stone-300 dark:border-stone-400 checked:border-blue-500 dark:checked:border-blue-600',
            'checked:bg-blue-500 dark:checked:bg-blue-600',
            'focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-700',
            'transition-colors duration-300 ease-in-out',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      </div>
      <div className="flex flex-col items-stretch justify-start gap-1">
        <label
          htmlFor={id}
          className={classNames(
            'text-sm font-medium whitespace-nowrap leading-5',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {label}
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
