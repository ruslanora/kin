import type {
  ResumeContentType,
  ResumeSectionType,
  ResumeWithSectionsType,
} from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

import { ResumeHeader } from './resume-header';
import { ResumeSection } from './resume-section';

type PropsType = {
  resume: ResumeWithSectionsType;
};

export const SourceResume: FunctionComponent<PropsType> = ({ resume }) => {
  const visibleSections = resume.sections.filter((s) => s.isVisible !== false);

  return (
    <>
      <ResumeHeader resume={resume} />
      {visibleSections.map((section) => (
        <ResumeSection
          key={section.id}
          chunk={{
            section: section as ResumeSectionType & {
              contents: ResumeContentType[];
            },
            contentRange: [
              0,
              section.contents.filter((c) => c.isVisible !== false).length,
            ],
            showSectionHeading: true,
          }}
        />
      ))}
    </>
  );
};
