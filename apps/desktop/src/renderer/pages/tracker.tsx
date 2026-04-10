import type { FunctionComponent } from 'react';

import { Tracker, TrackerContextProvider, TrackerPanel } from '../features';
import { PageContainer } from './container';

export const TrackerPage: FunctionComponent = () => (
  <TrackerContextProvider>
    <PageContainer panel={<TrackerPanel />}>
      <Tracker />
    </PageContainer>
  </TrackerContextProvider>
);
