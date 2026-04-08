import type { ResumeContentType } from '@kin/desktop/main/database';
import { Textarea } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { useResume } from '../context';

type PropsType = {
  content: ResumeContentType;
};

export const ListRecord: FunctionComponent<PropsType> = ({ content }) => {
  const { updateContent } = useResume();

  const [contentValue, setContentValue] = useState(content.content ?? '');

  const handleContentChange = (html: string) => {
    setContentValue(html);
    updateContent(content.id, { content: html });
  };

  return (
    <Textarea
      placeholder="List items"
      value={contentValue}
      setValue={handleContentChange}
    />
  );
};
