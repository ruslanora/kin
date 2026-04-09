import type { JobType } from '@kin/desktop/main/database';
import { RichTextEditor, Select, TextInput, Typography } from '@kin/ui';
import { type FunctionComponent, useState } from 'react';

import { EMPLOYMENT_TYPE_OPTIONS, WORK_MODEL_OPTIONS } from './constants';
import { useJob } from './context';

export const JobInfo: FunctionComponent = () => {
  const { job, updateJob } = useJob();

  const [fields, setFields] = useState<Partial<JobType>>({
    employmentType: job.employmentType,
    workModel: job.workModel,
    salaryRangeFrom: job.salaryRangeFrom,
    salaryRangeTo: job.salaryRangeTo,
    url: job.url,
    description: job.description,
  });

  return (
    <div className="w-full flex flex-col items-stretch justify-start gap-8">
      <div className="w-full h-9 flex flex-row items-center justify-between">
        <Typography.Heading level="h2">Job Info</Typography.Heading>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          placeholder="Employment Type"
          selected={fields.employmentType}
          setSelected={(employmentType) => {
            const value = (employmentType as string) || null;
            setFields({ ...fields, employmentType: value ?? undefined });
            updateJob({ employmentType: value });
          }}
          options={EMPLOYMENT_TYPE_OPTIONS}
        />
        <Select
          placeholder="Work Model"
          selected={fields.workModel}
          setSelected={(workModel) => {
            const value = (workModel as string) || null;
            setFields({ ...fields, workModel: value ?? undefined });
            updateJob({ workModel: value });
          }}
          options={WORK_MODEL_OPTIONS}
        />
        <TextInput
          label="Salary Range From"
          value={fields.salaryRangeFrom?.toString() ?? ''}
          onChange={(v) =>
            setFields({ ...fields, salaryRangeFrom: v ? Number(v) : undefined })
          }
          onBlur={() =>
            updateJob({ salaryRangeFrom: fields.salaryRangeFrom ?? null })
          }
        />
        <TextInput
          label="Salary Range To"
          value={fields.salaryRangeTo?.toString() ?? ''}
          onChange={(v) =>
            setFields({ ...fields, salaryRangeTo: v ? Number(v) : undefined })
          }
          onBlur={() =>
            updateJob({ salaryRangeTo: fields.salaryRangeTo ?? null })
          }
        />
        <div className="col-span-2">
          <TextInput
            label="Job Post URL"
            value={fields.url ?? ''}
            onChange={(url) => setFields({ ...fields, url })}
            onBlur={() => updateJob({ url: fields.url || null })}
          />
        </div>
        <div className="col-span-2">
          <RichTextEditor
            placeholder="Job Description"
            value={fields.description ?? ''}
            onChange={(description) => setFields({ ...fields, description })}
            onBlur={(description) =>
              updateJob({ description: description || null })
            }
          />
        </div>
      </div>
    </div>
  );
};
