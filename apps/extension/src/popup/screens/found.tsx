import { Icon, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import type { JobResultType } from '../types';

type PropsType = {
  data: JobResultType;
};

export const FoundScreen: FunctionComponent<PropsType> = ({ data }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center gap-8 py-12">
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-200 text-blue-900 shrink-0">
        <Icon name="eye" size={24} />
      </div>
      <Typography.Heading level="h2">Already Applied</Typography.Heading>
      <Typography.Paragraph>
        Check the {data.columnName} colimn in the job tracker board.
      </Typography.Paragraph>
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1 text-left">
        {data.title && (
          <>
            <span className="font-medium text-stone-950 dark:text-stone-50">
              Title
            </span>
            <span>{data.title}</span>
          </>
        )}
        <span className="font-medium text-stone-950 dark:text-stone-50">
          Company
        </span>
        <span>{data.companyName}</span>
      </div>
    </div>
  );
};
