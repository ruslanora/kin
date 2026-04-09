import { Spinner, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { useJob } from './context';
import { TabControl } from './tab-control';

export const Job: FunctionComponent = () => {
  const { loading, error, job } = useJob();

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-4">
        <Typography.Heading as="h2">
          Oops! Something went wrong.
        </Typography.Heading>
        <Typography.Paragraph>Could not load this job.</Typography.Paragraph>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-stretch justify-start">
      <div className="w-full flex-1 min-h-0 flex flex-col">
        <TabControl />
      </div>
    </div>
  );
};
