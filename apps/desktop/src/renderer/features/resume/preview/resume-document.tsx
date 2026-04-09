import type {
  ResumeContentType,
  ResumeSectionType,
  ResumeWithSectionsType,
} from '@kin/desktop/main/database';
import { type FunctionComponent, useRef } from 'react';

import { DESIGN_MAP } from './designs/index';
import { PageLayout } from './page-layout';
import { ResumeHeader } from './resume-header';
import { ResumeSection } from './resume-section';
import { usePageBreaks } from './use-page-breaks';

type Props = {
  resume: ResumeWithSectionsType;
  spacingMultiplier: number;
};

const SourceResume: FunctionComponent<{ resume: ResumeWithSectionsType }> = ({
  resume,
}) => {
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

export const ResumeDocument: FunctionComponent<Props> = ({
  resume,
  spacingMultiplier,
}) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const pages = usePageBreaks(sourceRef, resume);

  const design =
    DESIGN_MAP[resume.design ?? 'classic'] ?? DESIGN_MAP['classic'];

  return (
    <div
      className={`resume-root design-${design.id}`}
      style={
        { '--spacing-multiplier': spacingMultiplier } as React.CSSProperties
      }
    >
      {design.css && <style>{design.css}</style>}
      <div
        ref={sourceRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: 816,
          top: 0,
          left: 0,
          padding: 72,
          boxSizing: 'border-box',
        }}
      >
        <SourceResume resume={resume} />
      </div>
      {pages.map((page, i) => (
        <PageLayout key={i} page={page} resume={resume} />
      ))}
    </div>
  );
};
