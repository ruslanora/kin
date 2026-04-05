import { Spinner } from '@kin/ui';
import type { FunctionComponent } from 'react';

export const Loading: FunctionComponent = () => (
  <div className="h-full flex items-center justify-center">
    <Spinner size="md" />
  </div>
);
