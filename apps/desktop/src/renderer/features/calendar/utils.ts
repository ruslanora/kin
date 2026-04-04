import type { CalendarCellType } from './types';

export const getCurrentMonth = (): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

export const getMonthKey = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth()}`;

export const getDayKey = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const getCellKey = (year: number, month: number, day: number): string =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const getInterviewKey = (scheduledAt: Date): string => {
  const d = new Date(scheduledAt);
  return getCellKey(d.getFullYear(), d.getMonth(), d.getDate());
};

export const getTodayKey = (): string => {
  const today = new Date();
  return getCellKey(today.getFullYear(), today.getMonth(), today.getDate());
};

export const getCellsForMonth = (month: Date): CalendarCellType[] => {
  const year = month.getFullYear();
  const m = month.getMonth();

  const firstDow = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, m, 0).getDate();

  const cells: CalendarCellType[] = [];

  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrevMonth - i,
      month: m === 0 ? 11 : m - 1,
      year: m === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: m, year, isCurrentMonth: true });
  }

  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      day: d,
      month: m === 11 ? 0 : m + 1,
      year: m === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  return cells;
};

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const formatTime = (date: Date): string =>
  new Date(date).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
