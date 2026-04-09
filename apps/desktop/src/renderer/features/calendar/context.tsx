import type { InterviewWithJobType } from '@kin/desktop/main/database';
import {
  createContext,
  type FunctionComponent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { CalendarCellType } from './types';
import {
  getCellKey,
  getCellsForMonth,
  getCurrentMonth,
  getDayKey,
  getInterviewKey,
  getMonthKey,
} from './utils';

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

export const CalendarContextProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [month, setMonth] = useState<Date>(getCurrentMonth);
  const [day, setDay] = useState<Date | null>(null);
  const [monthInterviews, setMonthInterviews] = useState<
    InterviewWithJobType[]
  >([]);
  const [dayInterviews, setDayInterviews] = useState<InterviewWithJobType[]>(
    [],
  );
  const cache = useRef<Map<string, InterviewWithJobType[]>>(new Map());

  useEffect(() => {
    const key = getMonthKey(month);

    if (cache.current.has(key)) {
      setMonthInterviews(cache.current.get(key)!);
      return;
    }

    window.api.interview
      .getByMonth(month.getFullYear(), month.getMonth() + 1)
      .then((data: InterviewWithJobType[]) => {
        cache.current.set(key, data);
        setMonthInterviews(data);
      });
  }, [month]);

  const cells = useMemo(() => getCellsForMonth(month), [month]);

  const interviewsByDate = useMemo(() => {
    const map = new Map<string, InterviewWithJobType[]>();

    for (const interview of monthInterviews) {
      const key = getInterviewKey(interview.scheduledAt);
      map.set(key, [...(map.get(key) ?? []), interview]);
    }

    return map;
  }, [monthInterviews]);

  const goToPreviousMonth = useCallback(() => {
    setMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
    setDay(null);
    setDayInterviews([]);
  }, []);

  const goToNextMonth = useCallback(() => {
    setMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
    setDay(null);
    setDayInterviews([]);
  }, []);

  const goToCurrentMonth = useCallback(() => {
    setMonth(getCurrentMonth());
    setDay(null);
    setDayInterviews([]);
  }, []);

  const handleDayOnClick = useCallback(
    (target: Date) => {
      if (day && getDayKey(day) === getDayKey(target)) {
        setDay(null);
        setDayInterviews([]);
      } else {
        const key = getCellKey(
          target.getFullYear(),
          target.getMonth(),
          target.getDate(),
        );

        setDay(target);
        setDayInterviews(interviewsByDate.get(key) ?? []);
      }
    },
    [day, interviewsByDate],
  );

  const handleDayOnClose = useCallback(() => {
    setDay(null);
    setDayInterviews([]);
  }, []);

  const context = useMemo(
    () => ({
      month,
      day,
      cells,
      dayInterviews,
      interviewsByDate,
      goToPreviousMonth,
      goToNextMonth,
      goToCurrentMonth,
      handleDayOnClick,
      handleDayOnClose,
    }),
    [
      month,
      day,
      cells,
      dayInterviews,
      interviewsByDate,
      goToPreviousMonth,
      goToNextMonth,
      goToCurrentMonth,
      handleDayOnClick,
      handleDayOnClose,
    ],
  );

  return (
    <CalendarContext.Provider value={context}>
      {children}
    </CalendarContext.Provider>
  );
};
