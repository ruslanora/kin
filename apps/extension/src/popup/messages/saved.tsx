import { Badge, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import type { JobResultType } from '../../types';

type PropsType = {
  job: JobResultType;
};

export const Saved: FunctionComponent<PropsType> = ({ job }) => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="h-full flex flex-col items-center justify-center gap-2 p-6 text-center">
      <Badge variant="success">Saved</Badge>
      <Typography.Paragraph>
        {job.title ?? job.companyName} • {job.companyName}
      </Typography.Paragraph>
    </div>
  </div>
);
