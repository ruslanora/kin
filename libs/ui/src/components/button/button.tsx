'use client';

import { classNames } from '@kin/ui';
import type {
  FocusEventHandler,
  FunctionComponent,
  MouseEventHandler,
  ReactNode,
} from 'react';

import { Spinner } from '../spinner';

type ButtonSizeType = 'sm' | 'md' | 'lg';

type ButtonStyleType =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'danger'
  | 'ghost';

type PropsType = {
  type?: 'button' | 'submit';
  size?: ButtonSizeType;
  style?: ButtonStyleType;
  width?: 'fit' | 'full';
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  children?: ReactNode;
};

export const Button: FunctionComponent<PropsType> = ({
  type = 'button',
  size = 'md',
  style = 'primary',
  width = 'fit',
  disabled = false,
  loading = false,
  onClick,
  onBlur,
  onFocus,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      className={classNames(
        'relative cursor-pointer inline-block box-border border rounded-xl shadow-xs',
        'font-medium leading-none tracking-normal',
        'transition-all duration-300 ease-in-out',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
        width === 'fit' ? 'w-fit' : 'w-full',
        size === 'sm' && 'text-xs px-3 py-2 h-8',
        size === 'md' && 'text-sm px-4 py-2.5 h-10',
        size === 'lg' && 'text-sm px-5 py-3 h-12',
        style === 'primary' &&
          'text-stone-50 bg-stone-950 border-stone-950 hover:bg-stone-800 hover:border-stone-800 dark:text-stone-950 dark:bg-stone-50 dark:border-stone-50 dark:hover:border-stone-200 dark:hover:bg-stone-200',
        style === 'secondary' &&
          'text-stone-950 bg-transparent border-stone-200 hover:bg-stone-200 dark:text-stone-50 dark:bg-transparent dark:border-stone-800 dark:hover:border-stone-800 hover:dark:bg-stone-800',
        style === 'accent' &&
          'text-stone-50 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600',
        style === 'success' &&
          'text-stone-50 bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600',
        style === 'danger' &&
          'text-stone-50 bg-rose-500 border-rose-500 hover:bg-rose-600 hover:border-rose-600',
        style === 'ghost' &&
          'text-stone-950 hover:text-blue-600 dark:text-stone-50 dark:hover:text-blue-500 bg-transparent border-transparent',
        !loading &&
          'disabled:text-stone-600 disabled:bg-stone-300 disabled:border-stone-300 disabled:cursor-not-allowed',
      )}
    >
      <div
        className={classNames(
          'absolute h-full w-full left-0 right-0 top-0 bottom-0 text-inherit',
          'flex flex-row items-center justify-center shrink-0',
          loading ? 'z-10 opacity-100' : '-z-10 opacity-0',
        )}
      >
        <Spinner size="sm" />
      </div>
      <div
        className={classNames(
          'h-fit w-full whitespace-nowrap flex-nowrap',
          'flex flex-row items-center justify-center shrink-0',
          loading ? '-z-10 opacity-0' : 'z-10 opacity-100',
        )}
      >
        {children}
      </div>
    </button>
  );
};
