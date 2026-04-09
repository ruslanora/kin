import type { ResumeContentType } from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

type PropsType = {
  content: ResumeContentType;
};

export const CategoryContent: FunctionComponent<PropsType> = ({ content }) => {
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
