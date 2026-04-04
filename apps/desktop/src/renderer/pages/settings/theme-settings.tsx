import { Radio, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { useTheme } from '../../hooks';

export const ThemeSettingsSection: FunctionComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section className="flex flex-col items-stretch justify-start gap-8">
      <Typography.Heading level="h2">Appearance</Typography.Heading>
      <Typography.Heading level="h3">Color Mode</Typography.Heading>
      <div className="w-fit grid grid-cols-3 gap-4">
        <Radio
          name="Light"
          value="light"
          selected={theme}
          setSelected={setTheme as (value: string) => void}
        />
        <Radio
          name="Dark"
          value="dark"
          selected={theme}
          setSelected={setTheme as (value: string) => void}
        />
        <Radio
          name="System"
          value="system"
          selected={theme}
          setSelected={setTheme as (value: string) => void}
        />
      </div>
    </section>
  );
};
