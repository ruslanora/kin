import type { FunctionComponent } from 'react';

import type { SectionChunkType } from '../../types';
import { CategoryContent } from './category-content';
import { ListContent } from './list-content';
import { PeriodContent } from './period-content';

type PropsType = {
  chunk: SectionChunkType;
};

export const ResumeSection: FunctionComponent<PropsType> = ({ chunk }) => {
  const { section, contentRange, showSectionHeading } = chunk;
  const [start, end] = contentRange;

  const visibleContents = section.contents
    .filter((c) => c.isVisible !== false)
    .slice(start, end);

  return (
    <div className="resume-section">
      {showSectionHeading && (
        <h2 className="resume-section-heading" data-section-id={section.id}>
          {section.name}
        </h2>
      )}
      {visibleContents.map((content) => (
        <div
          key={content.id}
          className={
            section.contentType === 'category'
              ? 'resume-category-item'
              : 'resume-content-item'
          }
          data-content-id={content.id}
        >
          {section.contentType === 'period' && (
            <PeriodContent content={content} />
          )}
          {section.contentType === 'category' && (
            <CategoryContent content={content} />
          )}
          {section.contentType === 'list' && <ListContent content={content} />}
        </div>
      ))}
    </div>
  );
};
