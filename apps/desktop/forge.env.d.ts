/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

import type { CalendarInterviewType } from './src/renderer/features/calendar/types';

declare module '*.css' {
  const content: string;
  export default content;
}

declare global {
  interface Window {
    api: {
      interview: {
        getByMonth: (
          year: number,
          month: number,
        ) => Promise<CalendarInterviewType[]>;
      };
    };
  }
}
