import type { ResumeContentType } from '@kin/desktop/main/database';
import { Textarea } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { useResume } from '../context';

type PropsType = {
  content: ResumeContentType;
};

export const ListRecord: FunctionComponent<PropsType> = ({ content }) => {
  const { patchContent, updateContent } = useResume();

  const [contentValue, setContentValue] = useState(content.content ?? '');

  const handleChange = (html: string) => {
    setContentValue(html);
    patchContent(content.id, { content: html });
  };

  return (
    <Textarea
      placeholder="List items"
      value={contentValue}
      setValue={handleChange}
      onBlur={() => updateContent(content.id, { content: contentValue })}
    />
  );
};
