import type { FunctionComponent } from 'react';

import { Database, DatabaseContextProvider, DatabasePanel } from '../features';
import { PageContainer } from './container';

export const DatabasePage: FunctionComponent = () => {
  return (
    <DatabaseContextProvider>
      <PageContainer panel={<DatabasePanel />}>
        <Database />
      </PageContainer>
    </DatabaseContextProvider>
  );
};
