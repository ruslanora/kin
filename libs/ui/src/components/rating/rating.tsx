'use client';

import { classNames } from '@kin/ui/utils';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

type PropsType = {
  value: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
};

const StarIcon: FunctionComponent<{ size?: number; className?: string }> = ({
  size = 20,
  className,
}) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
  </svg>
);

export const Rating: FunctionComponent<PropsType> = ({
  value,
  size = 20,
  max = 5,
  onChange,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const interactive = onChange !== undefined;
  const display = hovered ?? value;

  return (
    <div
      className={classNames(
        'flex items-center gap-0.5',
        interactive && 'cursor-pointer',
      )}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= display;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(starValue === value ? 0 : starValue)}
            onMouseEnter={() => interactive && setHovered(starValue)}
            className={classNames(
              'transition-colors duration-150',
              filled
                ? 'text-yellow-400 dark:text-yellow-300'
                : 'text-stone-300 dark:text-stone-600',
              interactive &&
                'hover:text-yellow-400 dark:hover:text-yellow-300 cursor-pointer',
              !interactive && 'cursor-default',
            )}
          >
            <StarIcon size={size} />
          </button>
        );
      })}
    </div>
  );
};
