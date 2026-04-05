import { Button, RichTextEditor, Select, TextInput, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import type { ColumnInfoType, JobResultType } from '../types';

type PropsType = {
  columns: ColumnInfoType[];
  title: string;
  setTitle: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  companyJobs: JobResultType[];
  companyIsToAvoid: boolean;
  columnId: number | null;
  setColumnId: (v: number | null) => void;
  url: string;
  setUrl: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  saving: boolean;
  onSubmit: () => void;
};

export const FormScreen: FunctionComponent<PropsType> = ({
  columns,
  title,
  setTitle,
  companyName,
  setCompanyName,
  companyJobs,
  companyIsToAvoid,
  columnId,
  setColumnId,
  url,
  setUrl,
  description,
  setDescription,
  saving,
  onSubmit,
}) => (
  <div className="flex flex-col gap-8">
    <Typography.Heading level="h2">Add to Kin</Typography.Heading>
    <div className="flex flex-col gap-2">
      <TextInput
        placeholder="Company name"
        value={companyName}
        setValue={setCompanyName}
      />
      {companyIsToAvoid && (
        <p className="text-xs text-red-600">
          This company is marked as one to avoid.
        </p>
      )}
      {!companyIsToAvoid && companyJobs.length > 0 && (
        <p className="text-xs text-amber-600">
          You have already applied to this company.
        </p>
      )}
      <TextInput placeholder="Job title" value={title} setValue={setTitle} />
      <TextInput placeholder="URL" value={url} setValue={setUrl} />
      <Select
        placeholder="Select column"
        selected={columnId}
        setSelected={(v) => setColumnId(v ? Number(v) : null)}
        options={columns.map((c) => ({ name: c.name, value: c.id }))}
      />
      <RichTextEditor
        value={description}
        onChange={setDescription}
        placeholder="Description"
      />
    </div>
    <Button
      width="full"
      loading={saving}
      disabled={!companyName.trim() || companyIsToAvoid}
      onClick={onSubmit}
    >
      <span className="w-full text-center">Add to Kin</span>
    </Button>
  </div>
);
