'use client';

import { classNames } from '@kin/ui/utils';
import type { FunctionComponent } from 'react';

type PropsType = {
  size?: 'sm' | 'md' | 'lg';
};

export const Spinner: FunctionComponent<PropsType> = ({ size = 'base' }) => (
  <span
    className={classNames(
      'inline-block box-border animate-spin',
      'rounded-full border-inherit border-b-transparent',
      size === 'sm' && 'h-4 w-4 border-2',
      size === 'md' && 'h-6 w-6 border-3',
      size === 'lg' && 'h-8 w-8 border-5',
    )}
  />
);
