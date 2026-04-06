import type { FileType } from '@kin/desktop/main/database';
import { Dropzone, File, Typography } from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import { useJob } from './context';

export const CoverLetter: FunctionComponent = () => {
  const { job } = useJob();

  const [files, setFiles] = useState<Array<FileType>>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const all = await window.api.file.getByJob({
        jobId: job.id,
        fileType: 'cover_letter',
      });

      setFiles(all);
    })();
  }, [job.id]);

  const handleFile = async (file: globalThis.File) => {
    setError(null);
    setUploading(true);
    try {
      const buffer = Array.from(new Uint8Array(await file.arrayBuffer()));

      const uploaded = await window.api.file.upload({
        jobId: job.id,
        fileType: 'cover_letter',
        fileName: file.name,
        buffer,
      });

      setFiles((prev) => [...prev, uploaded]);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (id: number) => {
    await window.api.file.delete({ id });
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="w-full flex flex-col items-stretch justify-start gap-8">
      <div className="w-full h-9 flex flex-row items-center justify-between">
        <Typography.Heading level="h2">Cover Letter</Typography.Heading>
      </div>
      {files.length > 0 ? (
        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <File
              key={file.id}
              name={file.fileName}
              onOpen={() => window.api.file.open({ id: file.id })}
              onRemove={() => handleRemove(file.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Dropzone
            onFile={handleFile}
            onError={setError}
            disabled={uploading}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};
