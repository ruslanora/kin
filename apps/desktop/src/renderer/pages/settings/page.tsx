import { Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { DataControlSection } from './data-control';
import { ThemeSettingsSection } from './theme-settings';

export const SettingsPage: FunctionComponent = () => (
  <div className="w-full flex flex-col items-center justify-start gap-16 p-4">
    <div className="w-full">
      <Typography.Heading level="h1">Settings</Typography.Heading>
    </div>
    <div className="w-full max-w-2xl gap-8 flex flex-col items-stretch justify-start px-auto">
      <ThemeSettingsSection />
      <DataControlSection />
    </div>
  </div>
);
