import type { ResumeContentType } from '@kin/desktop/main/database';
import {
  Checkbox,
  classNames,
  DatePicker,
  IconButton,
  RichTextEditor,
  TextInput,
} from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { toMonthString } from '../../utils';
import { useResume } from '../context';

type PropsType = {
  content: ResumeContentType;
};

export const PeriodRecord: FunctionComponent<PropsType> = ({ content }) => {
  const { patchContent, updateContent, deleteContent } = useResume();

  const isHidden = content.isVisible === false;
  const [fields, setFields] = useState({
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    location: content.location ?? '',
    startDate: toMonthString(content.startMonth, content.startYear),
    endDate: toMonthString(content.endMonth, content.endYear),
    isCurrent: content.isCurrent ?? false,
    content: content.content ?? '',
  });

  const handleChange = <K extends keyof typeof fields>(
    key: K,
    value: (typeof fields)[K],
  ) => {
    setFields((f) => ({ ...f, [key]: value }));
    patchContent(content.id, { [key]: value } as Partial<ResumeContentType>);
  };

  const handleBlur = (key: keyof typeof fields) => {
    updateContent(content.id, {
      [key]: fields[key],
    } as Partial<ResumeContentType>);
  };

  const handleDateChange = (key: 'startDate' | 'endDate', value: string) => {
    setFields((f) => ({ ...f, [key]: value }));

    const [year, month] = value ? value.split('-').map(Number) : [null, null];

    const patch =
      key === 'startDate'
        ? { startMonth: month || null, startYear: year || null }
        : { endMonth: month || null, endYear: year || null };

    patchContent(content.id, patch);
    updateContent(content.id, patch);
  };

  const handleCheckbox = (checked: boolean) => {
    setFields((f) => ({ ...f, isCurrent: checked }));
    patchContent(content.id, { isCurrent: checked });
    updateContent(content.id, { isCurrent: checked });
  };

  return (
    <div className="ml-4 flex flex-col items-stretch justify-start gap-4 pt-4 pb-2 border-t border-stone-200 dark:border-stone-800">
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1 min-w-0">
          <TextInput
            label="Company or Organization"
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
        <div className="flex flex-col gap-4">
          <TextInput
            label="Position or Title"
            value={fields.subtitle}
            onChange={(v) => handleChange('subtitle', v)}
            onBlur={() => handleBlur('subtitle')}
          />
          <TextInput
            label="Location"
            value={fields.location}
            onChange={(v) => handleChange('location', v)}
            onBlur={() => handleBlur('location')}
          />
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              type="month"
              value={fields.startDate}
              setValue={(v) => handleDateChange('startDate', v)}
            />
            {!fields.isCurrent && (
              <DatePicker
                type="month"
                value={fields.endDate}
                setValue={(v) => handleDateChange('endDate', v)}
              />
            )}
          </div>
          <Checkbox
            label="Current"
            checked={fields.isCurrent}
            onChange={handleCheckbox}
          />
          <RichTextEditor
            placeholder="Description"
            value={fields.content}
            onChange={(html) => handleChange('content', html)}
            onBlur={(html) => updateContent(content.id, { content: html })}
          />
        </div>
      </div>
    </div>
  );
};
