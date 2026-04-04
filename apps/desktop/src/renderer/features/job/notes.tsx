import { RichTextEditor, Typography } from '@kin/ui';
import { type FunctionComponent, useState } from 'react';

import { useJob } from './context';

export const Notes: FunctionComponent = () => {
  const { job, updateJob } = useJob();

  const [note, setNote] = useState<string>(job.note ?? '');

  return (
    <div className="w-full flex flex-col items-stretch justify-start gap-8">
      <div className="w-full h-9 flex flex-row items-center justify-between">
        <Typography.Heading level="h2">Notes</Typography.Heading>
      </div>
      <RichTextEditor
        placeholder="Note"
        value={note}
        onChange={setNote}
        onBlur={(value) => updateJob({ note: value || null })}
      />
    </div>
  );
};
