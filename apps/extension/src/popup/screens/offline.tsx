import { Icon, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

export const OfflineScreen: FunctionComponent = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center gap-8 py-12">
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-rose-200 text-rose-900 shrink-0">
        <Icon name="x" size={24} />
      </div>
      <Typography.Heading level="h2">Open Kin to Continue</Typography.Heading>
      <Typography.Paragraph>
        The Kin desktop app must be running to use this extension.
      </Typography.Paragraph>
    </div>
  );
};
