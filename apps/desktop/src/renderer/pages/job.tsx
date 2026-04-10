import type { FunctionComponent } from 'react';

import { Job, JobContextProvider, JobPanel } from '../features';
import { PageContainer } from './container';

export const JobPage: FunctionComponent = () => (
  <JobContextProvider>
    <PageContainer canGoBack panel={<JobPanel />}>
      <Job />
    </PageContainer>
  </JobContextProvider>
);
