import type { JobWithCompanyType } from '@kin/desktop/main/database';
import {
  classNames,
  Icon,
  RichTextEditor,
  TextInput,
  Typography,
} from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDatabase } from './context';

export const PersonPanel: FunctionComponent = () => {
  const { selectedContact, closeSidebar, updateContact } = useDatabase();

  const navigate = useNavigate();

  const [contact, setContact] = useState(selectedContact!);
  const [prev, setPrev] = useState(selectedContact);

  if (selectedContact !== prev) {
    setPrev(selectedContact);

    if (selectedContact !== null) {
      setContact(selectedContact);
    }
  }

  const [fields, setFields] = useState({
    firstName: contact.firstName,
    lastName: contact.lastName,
    title: contact.title ?? '',
    phone: contact.phone ?? '',
    email: contact.email ?? '',
    linkedin: contact.linkedin ?? '',
    website: contact.website ?? '',
    note: contact.note ?? '',
  });

  const [jobs, setJobs] = useState<JobWithCompanyType[]>([]);

  useEffect(() => {
    window.api.job.getByContact({ contactId: contact.id }).then(setJobs);
  }, [contact.id]);

  const blur = (key: string, value: unknown) => {
    updateContact({ id: contact.id, [key]: value || null });
  };

  return (
    <div className="flex flex-col gap-3">
      {contact.companyName && (
        <span className="text-sm text-stone-500 dark:text-stone-400">
          {contact.companyName}
        </span>
      )}

      <div className="grid grid-cols-2 gap-3">
        <TextInput
          placeholder="First Name"
          value={fields.firstName}
          setValue={(firstName) => setFields((f) => ({ ...f, firstName }))}
          onBlur={() => blur('firstName', fields.firstName)}
        />
        <TextInput
          placeholder="Last Name"
          value={fields.lastName}
          setValue={(lastName) => setFields((f) => ({ ...f, lastName }))}
          onBlur={() => blur('lastName', fields.lastName)}
        />
      </div>
      <TextInput
        placeholder="Title"
        value={fields.title}
        setValue={(title) => setFields((f) => ({ ...f, title }))}
        onBlur={() => blur('title', fields.title)}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          placeholder="Phone"
          value={fields.phone}
          setValue={(phone) => setFields((f) => ({ ...f, phone }))}
          onBlur={() => blur('phone', fields.phone)}
        />
        <TextInput
          placeholder="Email"
          value={fields.email}
          setValue={(email) => setFields((f) => ({ ...f, email }))}
          onBlur={() => blur('email', fields.email)}
        />
      </div>
      <TextInput
        placeholder="LinkedIn"
        value={fields.linkedin}
        setValue={(linkedin) => setFields((f) => ({ ...f, linkedin }))}
        onBlur={() => blur('linkedin', fields.linkedin)}
      />
      <TextInput
        placeholder="Website"
        value={fields.website}
        setValue={(website) => setFields((f) => ({ ...f, website }))}
        onBlur={() => blur('website', fields.website)}
      />
      <RichTextEditor
        placeholder="Notes"
        value={fields.note}
        onChange={(note) => {
          setFields((f) => ({ ...f, note }));
          updateContact({ id: contact.id, note: note || null });
        }}
      />

      {jobs.length > 0 && (
        <div className="mt-2 flex flex-col gap-1">
          <Typography.Heading level="h3" as="h3">
            Jobs
          </Typography.Heading>
          {jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => {
                closeSidebar();
                navigate(`/job/${job.id}`);
              }}
              className={classNames(
                'w-full flex flex-row items-center justify-between gap-3',
                'p-2 text-left rounded-md',
                'hover:opacity-70 transition-opacity cursor-pointer',
              )}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                  {job.title ?? 'Untitled Job'}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 truncate">
                  {job.companyName}
                </span>
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
