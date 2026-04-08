'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */

import { classNames } from '@kin/ui';
import { type FunctionComponent, useId } from 'react';

type PropsType = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helper?: string;
  disabled?: boolean;
};

export const Toggle: FunctionComponent<PropsType> = ({
  label,
  checked,
  onChange,
  helper,
  disabled,
}) => {
  const id = useId();

  return (
    <div className="flex flex-row flex-nowrap items-start justify-start gap-2">
      <div className="h-5 flex items-center shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={classNames(
            'relative inline-flex w-9 h-5 rounded-full',
            'transition-colors duration-200 ease-in-out',
            checked
              ? 'bg-blue-500 dark:bg-blue-600'
              : 'bg-stone-300 dark:bg-stone-600',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          <span
            className={classNames(
              'absolute top-0.5 h-4 w-4 rounded-full bg-white',
              'transition-transform duration-200 ease-in-out',
              checked ? 'translate-x-4' : 'translate-x-0.5',
            )}
          />
        </label>
      </div>
      <div className="flex flex-col items-stretch justify-start gap-1">
        <p
          className={classNames(
            'text-sm font-medium whitespace-nowrap leading-5',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {label}
        </p>
        {helper && (
          <p className="text-xs text-stone-600 dark:text-stone-400 whitespace-break-spaces">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
};
