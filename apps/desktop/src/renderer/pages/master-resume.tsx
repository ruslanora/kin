import type { ResumeWithSectionsType } from '@kin/desktop/main/database';
import { Spinner } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

import { ResumeBuilder, ResumeProvider } from '../features/builders/resume';

export const MasterResume: FunctionComponent = () => {
  const [resume, setResume] = useState<ResumeWithSectionsType | null>(null);

  useEffect(() => {
    window.api.resume.getMaster().then(setResume);
  }, []);

  if (!resume) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ResumeProvider initialResume={resume}>
      <ResumeBuilder />
    </ResumeProvider>
  );
};
