import type { ResumeContentType } from '@kin/desktop/main/database';
import { classNames, IconButton, Textarea, TextInput } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { useResume } from '../context';

type PropsType = {
  content: ResumeContentType;
};

export const CategoryRecord: FunctionComponent<PropsType> = ({ content }) => {
  const { patchContent, updateContent, deleteContent } = useResume();

  const isHidden = content.isVisible === false;

  const [fields, setFields] = useState({
    title: content.title ?? '',
    content: content.content ?? '',
  });

  const handleChange = <K extends keyof typeof fields>(
    key: K,
    value: string,
  ) => {
    setFields((f) => ({ ...f, [key]: value }));
    patchContent(content.id, { [key]: value });
  };

  const handleBlur = (key: keyof typeof fields) => {
    updateContent(content.id, { [key]: fields[key] });
  };

  return (
    <div
      className={classNames(
        'ml-4 flex flex-col gap-4 pt-4 pb-2',
        'border-t border-stone-200 dark:border-stone-800',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1 min-w-0">
          <TextInput
            label="Category Title"
            value={fields.title}
            onChange={(v) => handleChange('title', v)}
            onBlur={() => handleBlur('title')}
          />
        </div>
        <IconButton
          icon={isHidden ? 'eyeOff' : 'eye'}
          onClick={() => {
            patchContent(content.id, { isVisible: isHidden });
            updateContent(content.id, { isVisible: isHidden });
          }}
        />
        <IconButton icon="trash" onClick={() => deleteContent(content.id)} />
      </div>
      <div
        className={classNames(
          'flex flex-col gap-4 transition-opacity duration-200',
          isHidden && 'opacity-40',
        )}
      >
        <Textarea
          placeholder="Content"
          value={fields.content}
          setValue={(v) => handleChange('content', v)}
          onBlur={() => handleBlur('content')}
        />
      </div>
    </div>
  );
};
