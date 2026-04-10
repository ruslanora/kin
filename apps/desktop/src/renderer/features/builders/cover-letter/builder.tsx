import { RichTextEditor, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { AboutSection } from '../resume/about-section';
import { useCoverLetter } from './context';
import { CoverLetterPreview } from './preview';

export const CoverLetterBuilder: FunctionComponent = () => {
  const { coverLetter, patchContent, updateContent } = useCoverLetter();

  return (
    <div className="flex flex-row h-full overflow-hidden border-t border-stone-200 dark:border-stone-800">
      <div className="w-120 shrink-0 flex flex-col overflow-y-auto">
        <AboutSection />
        <div className="p-4 flex flex-col gap-2">
          <Typography.Heading level="h2" as="h1">
            Cover Letter
          </Typography.Heading>
          <RichTextEditor
            value={coverLetter?.content ?? ''}
            onChange={patchContent}
            onBlur={updateContent}
            placeholder="Write your cover letter here…"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden border-l border-stone-200 dark:border-stone-800">
        <CoverLetterPreview />
      </div>
    </div>
  );
};
