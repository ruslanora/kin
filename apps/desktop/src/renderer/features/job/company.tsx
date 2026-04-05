import type { CompanyType } from '@kin/desktop/main/database';
import { RichTextEditor, TextInput, Toggle, Typography } from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import { useJob } from './context';

export const Company: FunctionComponent = () => {
  const { job } = useJob();

  const [company, setCompany] = useState<CompanyType | null>(null);

  useEffect(() => {
    (async () => {
      await window.api.company.getById({ id: job.companyId }).then(setCompany);
    })();
  }, [job.companyId]);

  const save = async (fields: Partial<CompanyType>) => {
    if (!company) return;

    await window.api.company
      .update({ id: company.id, ...fields })
      .then((updated: CompanyType) => setCompany(updated));
  };

  if (!company) return null;

  return (
    <div className="w-full flex flex-col items-stretch justify-start gap-8">
      <div className="w-full h-9 flex flex-row items-center justify-between">
        <Typography.Heading level="h2">Company</Typography.Heading>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          placeholder="Company Name *"
          value={company.name}
          setValue={(name) => setCompany({ ...company, name })}
          onBlur={() => {
            if (company.name.trim()) save({ name: company.name.trim() });
          }}
        />
        <TextInput
          placeholder="Industry"
          value={company.industry ?? ''}
          setValue={(industry) => setCompany({ ...company, industry })}
          onBlur={() => save({ industry: company.industry || null })}
        />
        <div className="col-span-2">
          <TextInput
            placeholder="Address, Location"
            value={company.address ?? ''}
            setValue={(address) => setCompany({ ...company, address })}
            onBlur={() => save({ address: company.address || null })}
          />
        </div>
        <TextInput
          placeholder="LinkedIn"
          value={company.linkedin ?? ''}
          setValue={(linkedin) => setCompany({ ...company, linkedin })}
          onBlur={() => save({ linkedin: company.linkedin || null })}
        />
        <TextInput
          placeholder="Website"
          value={company.website ?? ''}
          setValue={(website) => setCompany({ ...company, website })}
          onBlur={() => save({ website: company.website || null })}
        />
        <div className="col-span-2">
          <RichTextEditor
            placeholder="Notes"
            value={company.note ?? ''}
            onChange={(note) => setCompany({ ...company, note })}
            onBlur={(note) => save({ note: note || null })}
          />
        </div>
        <div className="col-span-2">
          <Toggle
            label="Mark as avoid"
            checked={company.isToAvoid}
            onChange={(isToAvoid) => {
              setCompany({ ...company, isToAvoid });
              save({ isToAvoid });
            }}
          />
        </div>
      </div>
    </div>
  );
};
