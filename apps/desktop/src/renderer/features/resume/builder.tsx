import { Spinner } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { AboutSection } from './about-section';
import { useResume } from './context';
import { ResumePreview } from './preview';
import { ResumeSections } from './sections';

export const ResumeBuilder: FunctionComponent = () => {
  const { isLoading } = useResume();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-row h-full overflow-hidden">
      <div className="w-120 shrink-0 flex flex-col overflow-y-auto">
        <AboutSection />
        <div className="p-4">
          <ResumeSections />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center border-l border-stone-200 dark:border-stone-800">
        <ResumePreview />
      </div>
    </div>
  );
};
