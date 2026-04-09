import type { FunctionComponent } from 'react';

import { Grid } from './grid';
import { Sidebar } from './sidebar';

export const Calendar: FunctionComponent = () => (
  <div className="h-full w-full flex flex-row overflow-hidden">
    <div className="flex flex-col items-stretch justify-start flex-1">
      <Grid />
    </div>
    <Sidebar />
  </div>
);
