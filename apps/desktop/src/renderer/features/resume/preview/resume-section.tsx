import type { ResumeContentType } from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

import type { SectionChunkType } from './use-page-breaks';

type Props = {
  chunk: SectionChunkType;
};

export const ResumeSection: FunctionComponent<Props> = ({ chunk }) => {
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

const formatDate = (
  month: number | null | undefined,
  year: number | null | undefined,
): string => {
  if (!year) return '';

  if (!month) return String(year);

  const date = new Date(year, month - 1);

  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const PeriodContent: FunctionComponent<{ content: ResumeContentType }> = ({
  content,
}) => {
  const startStr = formatDate(content.startMonth, content.startYear);

  const endStr = content.isCurrent
    ? 'Present'
    : formatDate(content.endMonth, content.endYear);

  const dateRange = [startStr, endStr].filter(Boolean).join(' - ');

  return (
    <>
      <div className="resume-period-header">
        {content.title && (
          <span className="resume-period-title">{content.title}</span>
        )}
        {content.location && (
          <span className="resume-period-location">{content.location}</span>
        )}
      </div>
      {(content.subtitle || content.location) && (
        <div className="resume-period-subtitle-row">
          {content.subtitle && (
            <span className="resume-period-subtitle">{content.subtitle}</span>
          )}
          {dateRange && (
            <span className="resume-period-dates">{dateRange}</span>
          )}
        </div>
      )}
      {content.content && (
        <div
          className="resume-period-body"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      )}
    </>
  );
};

const CategoryContent: FunctionComponent<{ content: ResumeContentType }> = ({
  content,
}) => {
  return (
    <div>
      {content.title && (
        <span className="resume-category-title">{content.title}:</span>
      )}
      {content.content && (
        <span className="resume-category-body">{content.content}</span>
      )}
    </div>
  );
};

const ListContent: FunctionComponent<{ content: ResumeContentType }> = ({
  content,
}) => {
  return (
    <div
      className="resume-list-body"
      dangerouslySetInnerHTML={{ __html: content.content ?? '' }}
    />
  );
};
