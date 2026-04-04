import type { InterviewWithJobType } from '@kin/desktop/main/database';
import { createContext, useContext } from 'react';

import type { CalendarCellType } from './types';

type ContextType = {
  month: Date;
  day: Date | null;
  cells: CalendarCellType[];
  dayInterviews: InterviewWithJobType[];
  interviewsByDate: Map<string, InterviewWithJobType[]>;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
  handleDayOnClick: (date: Date) => void;
  handleDayOnClose: () => void;
};

export const CalendarContext = createContext<ContextType | null>(null);

export const useCalendar = (): ContextType => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error(
      'useCalendar must be called within CalendarContext provider!',
    );
  }

  return context;
};
