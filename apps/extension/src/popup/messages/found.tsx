import { Badge, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import type { JobResultType } from '../../types';

type PropsType = {
  job: JobResultType;
};

export const Found: FunctionComponent<PropsType> = ({ job }) => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <Typography.Heading level="h2">Already tracked</Typography.Heading>
        <Badge variant="success">Already Applied</Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-400">
        {job.title && (
          <>
            <span className="font-medium text-stone-950 dark:text-stone-50">
              Title
            </span>
            <span>{job.title}</span>
          </>
        )}
        <span className="font-medium text-stone-950 dark:text-stone-50">
          Company
        </span>
        <span>{job.companyName}</span>
        <span className="font-medium text-stone-950 dark:text-stone-50">
          Column
        </span>
        <span>{job.columnName}</span>
        {job.appliedAt && (
          <>
            <span className="font-medium text-stone-950 dark:text-stone-50">
              Applied
            </span>
            <span>{new Date(job.appliedAt).toLocaleDateString()}</span>
          </>
        )}
      </div>
    </div>
  </div>
);
