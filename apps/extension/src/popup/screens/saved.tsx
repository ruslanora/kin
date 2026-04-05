import { Icon, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import type { JobResultType } from '../types';

type PropsType = {
  data: JobResultType;
};

export const SavedScreen: FunctionComponent<PropsType> = ({ data }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center gap-8 py-12">
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-200 text-green-900 shrink-0">
        <Icon name="check" size={24} />
      </div>
      <Typography.Heading level="h2">The Job Has Been Saved</Typography.Heading>
      <Typography.Paragraph>
        Check the {data.columnName} colimn in the job tracker board.
      </Typography.Paragraph>
    </div>
  );
};
