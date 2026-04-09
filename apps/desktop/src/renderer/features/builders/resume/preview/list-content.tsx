import type { ResumeContentType } from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

type PropsType = {
  content: ResumeContentType;
};

export const ListContent: FunctionComponent<PropsType> = ({ content }) => {
  return (
    <div
      className="resume-list-body"
      dangerouslySetInnerHTML={{ __html: content.content ?? '' }}
    />
  );
};
