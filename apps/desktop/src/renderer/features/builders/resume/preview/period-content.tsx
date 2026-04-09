import type { ResumeContentType } from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

import { formatDate } from '../../utils';

type PropsType = {
  content: ResumeContentType;
};

export const PeriodContent: FunctionComponent<PropsType> = ({ content }) => {
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
