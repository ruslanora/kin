import {
  classNames,
  Icon,
  RichTextEditor,
  TextInput,
  Toggle,
  Typography,
} from '@kin/ui';
import { type FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatShortDate, formatTime } from '../../utils';
import { useDatabase } from './context';

export const CompanyPanel: FunctionComponent = () => {
  const { selectedCompany, allInterviews, closeSidebar, updateCompany } =
    useDatabase();
  const navigate = useNavigate();

  const [company, setCompany] = useState(selectedCompany!);
  const [prev, setPrev] = useState(selectedCompany);

  if (selectedCompany !== prev) {
    setPrev(selectedCompany);

    if (selectedCompany !== null) {
      setCompany(selectedCompany);
    }
  }

  const [fields, setFields] = useState({
    name: company.name,
    industry: company.industry ?? '',
    website: company.website ?? '',
    linkedin: company.linkedin ?? '',
    address: company.address ?? '',
    note: company.note ?? '',
    isToAvoid: company.isToAvoid,
  });

  const interviews = allInterviews.filter(
    (i) => i.companyName === company.name && !i.isFollowUp,
  );

  const blur = (key: string, value: unknown) => {
    updateCompany({ id: company.id, [key]: value || null });
  };

  return (
    <div className="flex flex-col gap-3">
      <TextInput
        placeholder="Company Name"
        value={fields.name}
        setValue={(name) => setFields((f) => ({ ...f, name }))}
        onBlur={() =>
          updateCompany({ id: company.id, name: fields.name || null })
        }
      />
      <TextInput
        placeholder="Industry"
        value={fields.industry}
        setValue={(industry) => setFields((f) => ({ ...f, industry }))}
        onBlur={() => blur('industry', fields.industry)}
      />
      <TextInput
        placeholder="Website"
        value={fields.website}
        setValue={(website) => setFields((f) => ({ ...f, website }))}
        onBlur={() => blur('website', fields.website)}
      />
      <TextInput
        placeholder="LinkedIn"
        value={fields.linkedin}
        setValue={(linkedin) => setFields((f) => ({ ...f, linkedin }))}
        onBlur={() => blur('linkedin', fields.linkedin)}
      />
      <TextInput
        placeholder="Address"
        value={fields.address}
        setValue={(address) => setFields((f) => ({ ...f, address }))}
        onBlur={() => blur('address', fields.address)}
      />
      <Toggle
        label="Avoid this company"
        checked={fields.isToAvoid}
        onChange={(isToAvoid) => {
          setFields((f) => ({ ...f, isToAvoid }));
          updateCompany({ id: company.id, isToAvoid });
        }}
      />
      <RichTextEditor
        placeholder="Notes"
        value={fields.note}
        onChange={(note) => {
          setFields((f) => ({ ...f, note }));
          updateCompany({ id: company.id, note: note || null });
        }}
      />
      {interviews.length > 0 && (
        <div className="mt-2 flex flex-col gap-1">
          <Typography.Heading level="h3" as="h3">
            Interviews
          </Typography.Heading>
          {interviews.map((interview) => (
            <button
              key={interview.id}
              type="button"
              onClick={() => {
                closeSidebar();
                navigate(`/job/${interview.jobId}`);
              }}
              className={classNames(
                'w-full flex flex-row items-center justify-between gap-3',
                'p-2 text-left rounded-md',
                'hover:opacity-70 transition-opacity cursor-pointer',
              )}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex flex-row items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {formatShortDate(interview.scheduledAt)} ·{' '}
                    {formatTime(interview.scheduledAt)}
                    {interview.round ? ` · ${interview.round}` : ''}
                  </span>
                </div>
                {interview.jobTitle && (
                  <span className="text-sm text-stone-700 dark:text-stone-300 truncate">
                    {interview.jobTitle}
                  </span>
                )}
              </div>
              <span className="shrink-0 text-stone-400 dark:text-stone-500">
                <Icon name="chevron-right" size={16} />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
