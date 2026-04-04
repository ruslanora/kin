import type { InterviewWithJobType } from '@kin/desktop/main/database';
import {
  type FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CalendarContext } from './context';
import { Grid } from './grid';
import { Sidebar } from './sidebar';
import { Toolbar } from './toolbar';
import {
  getCellKey,
  getCellsForMonth,
  getCurrentMonth,
  getDayKey,
  getInterviewKey,
  getMonthKey,
} from './utils';

export const Calendar: FunctionComponent = () => {
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
    setMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setDay(null);
    setDayInterviews([]);
  }, []);

  const goToNextMonth = useCallback(() => {
    setMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
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
      <div className="h-full w-full flex flex-row overflow-hidden">
        <div className="flex flex-col items-stretch justify-start flex-1">
          <Toolbar />
          <Grid />
        </div>
        <Sidebar />
      </div>
    </CalendarContext.Provider>
  );
};
