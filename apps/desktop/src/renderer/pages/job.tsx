import type { FunctionComponent } from 'react';

import { Job } from '../features';

export const JobPage: FunctionComponent = () => {
  return (
    <div className="h-full w-full flex flex-col items-stretch justify-start">
      <Job />
    </div>
  );
};
