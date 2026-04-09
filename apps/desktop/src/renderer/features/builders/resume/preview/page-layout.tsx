import type { ResumeWithSectionsType } from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

import type { PageContentType } from '../../types';
import { ResumeHeader } from './resume-header';
import { ResumeSection } from './resume-section';

type PropsType = {
  page: PageContentType;
  resume: ResumeWithSectionsType;
};

export const PageLayout: FunctionComponent<PropsType> = ({ page, resume }) => {
  return (
    <div
      className="resume-page"
      style={{
        width: 816,
        height: 1056,
        overflow: 'hidden',
        marginBottom: 16,
        background: 'white',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: 72 }}>
        {page.header && <ResumeHeader resume={resume} />}
        {page.chunks.map((chunk, chunkIndex) => {
          // Re-fetch the section from the live resume data so that edits made
          // in the left panel are reflected immediately in the preview.
          const freshSection = resume.sections.find(
            (section) => section.id === chunk.section.id,
          );
          const freshChunk = freshSection
            ? { ...chunk, section: freshSection }
            : chunk;
          return (
            <ResumeSection
              key={`${chunk.section.id}-${chunkIndex}`}
              chunk={freshChunk}
            />
          );
        })}
      </div>
    </div>
  );
};
