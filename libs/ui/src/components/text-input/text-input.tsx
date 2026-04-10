'use client';

import { classNames, Icon } from '@kin/ui';
import {
  type FocusEventHandler,
  type FunctionComponent,
  useId,
  useState,
} from 'react';

type PropsType = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  type?: 'text' | 'password';
  error?: string;
};

export const TextInput: FunctionComponent<PropsType> = ({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  error,
}) => {
  const [hidden, setHidden] = useState<boolean>(type === 'password');
  const [isFocused, setIsFocused] = useState(false);

  const id = useId();

  const floated = isFocused || value.length > 0;

  return (
    <div className="w-full flex flex-col items-stretch justify-start gap-2">
      <div className="relative">
        <input
          id={id}
          type={hidden ? 'password' : 'text'}
          value={value}
          placeholder=" "
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          className={classNames(
            'block w-full h-10 px-3',
            'text-sm font-medium text-stone-950 dark:text-stone-50',
            'bg-stone-50 dark:bg-stone-950',
            'border rounded-xl shadow-xs',
            'focus:outline-none',
            'transition-all duration-300 ease-in-out',
            type === 'password' && 'pr-13',
            error
              ? 'bg-rose-100! dark:bg-rose-300! border-rose-600! dark:border-rose-800!'
              : 'border-stone-200 dark:border-stone-800',
            isFocused &&
              (error
                ? 'ring-4 ring-rose-300 dark:ring-rose-700'
                : 'ring-4 ring-blue-300 dark:ring-blue-700'),
          )}
        />
        <label
          htmlFor={id}
          className={classNames(
            'absolute z-10 origin-left inset-s-1 px-3 pointer-events-none',
            'text-sm transform transition-all duration-300',
            floated
              ? '-translate-y-4 scale-75 top-1 bg-stone-50 dark:bg-stone-950'
              : 'scale-100 top-1/2 -translate-y-1/2',
            error
              ? 'text-rose-500 dark:text-rose-400'
              : isFocused
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-stone-500 dark:text-stone-400',
          )}
        >
          {label}
        </label>
        {type === 'password' && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            className={classNames(
              'h-10 w-10',
              'absolute top-0 bottom-0 right-0 z-10',
              'flex items-center justify-center shrink-0',
              'bg-transparent',
              'text-stone-600 dark:text-stone-400',
            )}
            onClick={() => setHidden((v) => !v)}
          >
            <Icon name={hidden ? 'eye' : 'eyeOff'} size={18} />
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
};
