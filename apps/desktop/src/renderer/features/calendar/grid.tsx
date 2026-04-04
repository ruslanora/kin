import { classNames } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { Cell } from './cell';
import { DAY_LABELS } from './constants';
import { useCalendar } from './context';

export const Grid: FunctionComponent = () => {
  const { cells, interviewsByDate, handleDayOnClick } = useCalendar();

  return (
    <div className="flex flex-col items-stretch justify-start flex-1 px-4 pb-4 min-h-0">
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label: string) => (
          <div
            key={`day-label-${label}`}
            className={classNames(
              'py-2',
              'text-xs font-medium text-center',
              'text-stone-400 dark:text-stone-500',
            )}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 flex-1 gap-px bg-stone-200 dark:bg-stone-800 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800">
        {cells.map((cell, i) => {
          const key = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
          const interviews = interviewsByDate.get(key) ?? [];

          return (
            <Cell
              key={i}
              cell={cell}
              interviews={interviews}
              onClick={handleDayOnClick}
            />
          );
        })}
      </div>
    </div>
  );
};
