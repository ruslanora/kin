import { Textarea, TextInput, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { useResume } from './context';

export const AboutSection: FunctionComponent = () => {
  const { resume, patchBasicInfo, updateBasicInfo } = useResume();

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

  const handleChange = <K extends keyof typeof fields>(
    key: K,
    value: string,
  ) => {
    setFields((previousFields) => ({ ...previousFields, [key]: value }));
    patchBasicInfo({ [key]: value });
  };

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
            onChange={(value) => handleChange('firstName', value)}
            onBlur={() => handleBlur('firstName')}
          />
          <TextInput
            label="Last Name"
            value={fields.lastName}
            onChange={(value) => handleChange('lastName', value)}
            onBlur={() => handleBlur('lastName')}
          />
          <TextInput
            label="Email"
            value={fields.email}
            onChange={(value) => handleChange('email', value)}
            onBlur={() => handleBlur('email')}
          />
          <TextInput
            label="Phone"
            value={fields.phone}
            onChange={(value) => handleChange('phone', value)}
            onBlur={() => handleBlur('phone')}
          />
        </div>
        <TextInput
          label="LinkedIn"
          value={fields.linkedin}
          onChange={(value) => handleChange('linkedin', value)}
          onBlur={() => handleBlur('linkedin')}
        />
        <TextInput
          label="Website"
          value={fields.website}
          onChange={(value) => handleChange('website', value)}
          onBlur={() => handleBlur('website')}
        />
        <TextInput
          label="Address"
          value={fields.address}
          onChange={(value) => handleChange('address', value)}
          onBlur={() => handleBlur('address')}
        />
        <Textarea
          placeholder="Summary"
          value={fields.summary}
          setValue={(value) => handleChange('summary', value)}
          onBlur={() => handleBlur('summary')}
          rows={3}
        />
      </div>
    </>
  );
};
