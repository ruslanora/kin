import type {
  CoverLetterType,
  ResumeWithSectionsType,
} from '@kin/desktop/main/database';
import { Spinner, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

import {
  CoverLetterBuilder,
  CoverLetterProvider,
} from '../features/builders/cover-letter';
import { ResumeProvider } from '../features/builders/resume';
import { PageContainer } from './container';

export const MasterCoverLetter: FunctionComponent = () => {
  const [resume, setResume] = useState<ResumeWithSectionsType | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterType | null>(null);

  useEffect(() => {
    Promise.all([
      window.api.resume.getMaster(),
      window.api.coverLetter.getMaster(),
    ]).then(([r, cl]) => {
      setResume(r);
      setCoverLetter(cl);
    });
  }, []);

  if (!resume || !coverLetter) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ResumeProvider initialResume={resume}>
      <CoverLetterProvider initialCoverLetter={coverLetter}>
        <PageContainer
          panel={<Typography.Heading as="h2">Master Resume</Typography.Heading>}
        >
          <CoverLetterBuilder />
        </PageContainer>
      </CoverLetterProvider>
    </ResumeProvider>
  );
};
