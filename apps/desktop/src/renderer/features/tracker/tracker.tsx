import { Spinner, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { Board } from './board';
import { useTracker } from './context';

export const Tracker: FunctionComponent = () => {
  const { loading, error, board } = useTracker();

  if (loading && !board.id) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-4">
        <Typography.Heading as="h2">
          Oops! Something went wrong.
        </Typography.Heading>
        <Typography.Paragraph>
          The tool is broken and we are (probably) working on it.
        </Typography.Paragraph>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-stretch justify-start">
      <Board />
    </div>
  );
};
