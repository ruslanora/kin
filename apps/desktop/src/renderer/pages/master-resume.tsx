import type { ResumeWithSectionsType } from '@kin/desktop/main/database';
import { Spinner, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

import { ResumeBuilder, ResumeProvider } from '../features/builders/resume';
import { PageContainer } from './container';

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
      <PageContainer
        panel={<Typography.Heading as="h2">Master Resume</Typography.Heading>}
      >
        <ResumeBuilder />
      </PageContainer>
    </ResumeProvider>
  );
};
