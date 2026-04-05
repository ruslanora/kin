import { Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

export const Offline: FunctionComponent = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
      <Typography.Heading level="h2">Open Kin to continue</Typography.Heading>
      <Typography.Paragraph>
        The Kin desktop app must be running to use this extension.
      </Typography.Paragraph>
    </div>
  </div>
);
