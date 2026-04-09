import type { InterviewWithJobType } from '@kin/desktop/main/database';
import { classNames } from '@kin/ui';
import type { FunctionComponent } from 'react';

import type { CalendarCellType } from './types';
import { getCellKey, getTodayKey } from './utils';

type PropsType = {
  cell: CalendarCellType;
  interviews: InterviewWithJobType[];
  onClick: (date: Date) => void;
};

export const Cell: FunctionComponent<PropsType> = ({
  cell,
  interviews,
  onClick,
}) => {
  const key = getCellKey(cell.year, cell.month, cell.day);
  const isToday = key === getTodayKey();
  const hasInterviews = interviews.length > 0;

  return (
    <button
      type="button"
      disabled={!hasInterviews}
      onClick={() => {
        if (hasInterviews) {
          onClick(new Date(cell.year, cell.month, cell.day));
        }
      }}
      className={classNames(
        'flex flex-col items-start p-2 gap-1 text-left',
        'bg-stone-50 dark:bg-stone-900',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 focus:z-10',
        'transition-colors',
        hasInterviews &&
          'hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer',
        !hasInterviews && 'cursor-default',
      )}
    >
      <span
        className={classNames(
          'text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium',
          isToday &&
            'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900',
          !isToday &&
            cell.isCurrentMonth &&
            'text-stone-900 dark:text-stone-100',
          !isToday &&
            !cell.isCurrentMonth &&
            'text-stone-300 dark:text-stone-600',
        )}
      >
        {cell.day}
      </span>
      {hasInterviews && (
        <div className="flex flex-row gap-0.5 flex-wrap">
          {interviews.slice(0, 3).map((_, idx) => (
            <span
              key={idx}
              className="w-1.5 h-1.5 rounded-full bg-stone-500 dark:bg-stone-400 shrink-0"
            />
          ))}
          {interviews.length > 3 && (
            <span className="text-xs leading-none text-stone-400 dark:text-stone-500">
              +{interviews.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
};
