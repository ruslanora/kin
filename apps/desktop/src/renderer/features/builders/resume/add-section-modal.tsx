import { Button, Modal, Radio, TextInput, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { useResume } from './context';

type DisclosureType = {
  state: boolean;
  open: () => void;
  close: () => void;
};

type PropsType = {
  modal: DisclosureType;
};

type ContentType = 'period' | 'category' | 'list';

const CONTENT_TYPE_OPTIONS: Array<{
  value: ContentType;
  label: string;
  description: string;
}> = [
  {
    value: 'period',
    label: 'Period',
    description: 'Entries with start/end dates (e.g. jobs, education)',
  },
  {
    value: 'category',
    label: 'Category',
    description: 'Entries grouped by category (e.g. skills)',
  },
  {
    value: 'list',
    label: 'List',
    description: 'A single rich-text list',
  },
];

export const AddSectionModal: FunctionComponent<PropsType> = ({ modal }) => {
  const { addSection } = useResume();

  const [contentType, setContentType] = useState<ContentType>('period');
  const [name, setName] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;

    await addSection(contentType, name.trim());

    setName('');
    setContentType('period');
    modal.close();
  };

  return (
    <Modal {...modal}>
      <Modal.Header>Add Section</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <div>
            <Typography.Heading level="h3">Section Type</Typography.Heading>
            <div className="flex flex-col gap-2 pt-4">
              {CONTENT_TYPE_OPTIONS.map((opt) => (
                <Radio
                  key={opt.value}
                  name={opt.label}
                  value={opt.value}
                  selected={contentType}
                  setSelected={(value) => setContentType(value as ContentType)}
                  helper={opt.description}
                />
              ))}
            </div>
          </div>
          <TextInput label="Section Name" value={name} onChange={setName} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" style="secondary" onClick={modal.close}>
          Cancel
        </Button>
        <Button
          type="button"
          style="primary"
          disabled={!name.trim()}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
