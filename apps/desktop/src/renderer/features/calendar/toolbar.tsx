import { Button, classNames, IconButton, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { MONTHS } from './constants';
import { useCalendar } from './context';

export const Toolbar: FunctionComponent = () => {
  const { month, goToCurrentMonth, goToNextMonth, goToPreviousMonth } =
    useCalendar();

  return (
    <div
      className={classNames(
        'w-full flex flex-row items-center justify-between p-4 shrink-0',
        'flex-nowrap whitespace-nowrap',
      )}
    >
      <Typography.Heading>
        {MONTHS[month.getMonth()]} {month.getFullYear()}
      </Typography.Heading>
      <div className="flex flex-row items-center justify-center gap-2">
        <IconButton icon="arrow-left" onClick={goToPreviousMonth} />
        <Button style="secondary" onClick={goToCurrentMonth}>
          Today
        </Button>
        <IconButton icon="arrow-right" onClick={goToNextMonth} />
      </div>
    </div>
  );
};
