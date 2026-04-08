import { Textarea, TextInput, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { useResume } from './context';

export const AboutSection: FunctionComponent = () => {
  const { resume, updateBasicInfo } = useResume();

  const [fields, setFields] = useState({
    firstName: resume?.firstName ?? '',
    lastName: resume?.lastName ?? '',
    email: resume?.email ?? '',
    phone: resume?.phone ?? '',
    linkedin: resume?.linkedin ?? '',
    website: resume?.website ?? '',
    address: resume?.address ?? '',
    summary: resume?.summary ?? '',
  });

  const handleBlur = (key: keyof typeof fields) => {
    updateBasicInfo({ [key]: fields[key] });
  };

  return (
    <>
      <div className="p-4 pb-0">
        <Typography.Heading level="h2" as="h1">
          About
        </Typography.Heading>
      </div>
      <div className="flex flex-col gap-4 p-4 pb-2">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="First Name"
            value={fields.firstName}
            onChange={(v) => setFields((f) => ({ ...f, firstName: v }))}
            onBlur={() => handleBlur('firstName')}
          />
          <TextInput
            label="Last Name"
            value={fields.lastName}
            onChange={(v) => setFields((f) => ({ ...f, lastName: v }))}
            onBlur={() => handleBlur('lastName')}
          />
          <TextInput
            label="Email"
            value={fields.email}
            onChange={(v) => setFields((f) => ({ ...f, email: v }))}
            onBlur={() => handleBlur('email')}
          />
          <TextInput
            label="Phone"
            value={fields.phone}
            onChange={(v) => setFields((f) => ({ ...f, phone: v }))}
            onBlur={() => handleBlur('phone')}
          />
        </div>
        <TextInput
          label="LinkedIn"
          value={fields.linkedin}
          onChange={(v) => setFields((f) => ({ ...f, linkedin: v }))}
          onBlur={() => handleBlur('linkedin')}
        />
        <TextInput
          label="Website"
          value={fields.website}
          onChange={(v) => setFields((f) => ({ ...f, website: v }))}
          onBlur={() => handleBlur('website')}
        />
        <TextInput
          label="Address"
          value={fields.address}
          onChange={(v) => setFields((f) => ({ ...f, address: v }))}
          onBlur={() => handleBlur('address')}
        />
        <Textarea
          placeholder="Summary"
          value={fields.summary}
          setValue={(v) => setFields((f) => ({ ...f, summary: v }))}
          onBlur={() => handleBlur('summary')}
          rows={3}
        />
      </div>
    </>
  );
};
