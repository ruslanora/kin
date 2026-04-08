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

import { useResume } from '../context';

type PropsType = {
  content: ResumeContentType;
};

const toMonthString = (
  month: number | null | undefined,
  year: number | null | undefined,
) => (year && month ? `${year}-${String(month).padStart(2, '0')}` : '');

export const PeriodRecord: FunctionComponent<PropsType> = ({ content }) => {
  const { updateContent, deleteContent } = useResume();

  const [isHidden, setIsHidden] = useState(false);
  const [fields, setFields] = useState({
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    startDate: toMonthString(content.startMonth, content.startYear),
    endDate: toMonthString(content.endMonth, content.endYear),
    isCurrent: content.isCurrent ?? false,
    content: content.content ?? '',
  });

  const handleBlur = (key: keyof typeof fields) => {
    const value = fields[key];
    updateContent(content.id, { [key]: value });
  };

  const handleDateChange = (key: 'startDate' | 'endDate', value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    const [year, month] = value ? value.split('-').map(Number) : [null, null];
    if (key === 'startDate') {
      updateContent(content.id, {
        startMonth: month || null,
        startYear: year || null,
      });
    } else {
      updateContent(content.id, {
        endMonth: month || null,
        endYear: year || null,
      });
    }
  };

  const handleCheckbox = (checked: boolean) => {
    setFields((f) => ({ ...f, isCurrent: checked }));
    updateContent(content.id, { isCurrent: checked });
  };

  const handleContentChange = (html: string) => {
    setFields((f) => ({ ...f, content: html }));
    updateContent(content.id, { content: html });
  };

  return (
    <div className="ml-4 flex flex-col items-stretch justify-start gap-4 pt-4 pb-2 border-t border-stone-200 dark:border-stone-800">
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1 min-w-0">
          <TextInput
            label="Company or Organization"
            value={fields.title}
            onChange={(v) => setFields((f) => ({ ...f, title: v }))}
            onBlur={() => handleBlur('title')}
          />
        </div>
        <IconButton
          icon={isHidden ? 'eyeOff' : 'eye'}
          onClick={() => setIsHidden((v) => !v)}
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
            onChange={(v) => setFields((f) => ({ ...f, subtitle: v }))}
            onBlur={() => handleBlur('subtitle')}
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
            onChange={handleContentChange}
          />
        </div>
      </div>
    </div>
  );
};
