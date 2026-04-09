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

/**
 * A hidden, full-length render of the resume used only for measuring element
 * heights. The `usePageBreaks` hook queries this element to figure out how to
 * split content across pages. It is never visible to the user (aria-hidden).
 */
export const SourceResume: FunctionComponent<PropsType> = ({ resume }) => {
  const visibleSections = resume.sections.filter(
    (section) => section.isVisible !== false,
  );

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
              section.contents.filter((content) => content.isVisible !== false)
                .length,
            ],
            showSectionHeading: true,
          }}
        />
      ))}
    </>
  );
};
