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
        {page.chunks.map((chunk, i) => {
          const freshSection = resume.sections.find(
            (s) => s.id === chunk.section.id,
          );
          const freshChunk = freshSection
            ? { ...chunk, section: freshSection }
            : chunk;
          return (
            <ResumeSection
              key={`${chunk.section.id}-${i}`}
              chunk={freshChunk}
            />
          );
        })}
      </div>
    </div>
  );
};
