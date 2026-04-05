import { Spinner } from '@kin/ui';
import type { FunctionComponent } from 'react';

export const LoadingScreen: FunctionComponent = () => {
  return (
    <div className="w-full flex items-center justify-center py-12">
      <Spinner size="md" />
    </div>
  );
};
