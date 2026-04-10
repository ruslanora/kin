import type { FunctionComponent } from 'react';

import { Calendar, CalendarContextProvider, CalendarPanel } from '../features';
import { PageContainer } from './container';

export const CalendarPage: FunctionComponent = () => {
  return (
    <CalendarContextProvider>
      <PageContainer panel={<CalendarPanel />}>
        <Calendar />
      </PageContainer>
    </CalendarContextProvider>
  );
};
