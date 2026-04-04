'use client';

import { classNames } from '@kin/ui/utils';
import type { FunctionComponent } from 'react';

import { Icon } from '../icon';
import { IconButton } from '../icon-button';

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type PropsType = {
  name: string;
  size?: number;
  onRemove?: () => void;
};

export const File: FunctionComponent<PropsType> = ({
  name,
  size,
  onRemove,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-row items-center gap-3 px-3 py-2.5',
        'rounded-lg border border-stone-200 dark:border-stone-800',
        'bg-stone-50 dark:bg-stone-900',
      )}
    >
      <span className="shrink-0 text-stone-400 dark:text-stone-500">
        <Icon name="file" size={18} />
      </span>
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-sm font-medium truncate text-stone-800 dark:text-stone-200">
          {name}
        </p>
        {size !== undefined && (
          <p className="text-xs text-stone-400 dark:text-stone-500">
            {formatSize(size)}
          </p>
        )}
      </div>
      {onRemove && (
        <div className="shrink-0">
          <IconButton icon="x" onClick={onRemove} />
        </div>
      )}
    </div>
  );
};
