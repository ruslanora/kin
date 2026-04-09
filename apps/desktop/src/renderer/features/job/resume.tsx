import type {
  FileType,
  ResumeWithSectionsType,
} from '@kin/desktop/main/database';
import { Dropzone, File, Spinner, Typography } from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import { ResumeBuilder, ResumeProvider } from '../builders/resume';
import { BuildButton } from './build-button';
import { useJob } from './context';

export const Resume: FunctionComponent = () => {
  const { job, updateJob } = useJob();

  const isBuilding = job.resumeId != null;

  const [files, setFiles] = useState<Array<FileType>>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeWithSectionsType | null>(null);
  const [loadingBuilder, setLoadingBuilder] = useState(false);

  useEffect(() => {
    if (!isBuilding) {
      (async () => {
        const all = await window.api.file.getByJob({
          jobId: job.id,
          fileType: 'resume',
        });

        setFiles(all);
      })();
    }
  }, [job.id, isBuilding]);

  useEffect(() => {
    if (isBuilding && job.resumeId != null) {
      (async () => {
        setLoadingBuilder(true);

        try {
          const r = await window.api.resume.getById({ id: job.resumeId! });
          setResume(r);
        } finally {
          setLoadingBuilder(false);
        }
      })();
    }
  }, [isBuilding, job.resumeId]);

  const handleBuild = async () => {
    setLoadingBuilder(true);
    setError(null);

    try {
      const forked = await window.api.resume.fork();
      await updateJob({ resumeId: forked.id });

      setResume(forked);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoadingBuilder(false);
    }
  };

  const handleFile = async (file: globalThis.File) => {
    setError(null);
    setUploading(true);

    try {
      const buffer = Array.from(new Uint8Array(await file.arrayBuffer()));
      const uploaded = await window.api.file.upload({
        jobId: job.id,
        fileType: 'resume',
        fileName: file.name,
        buffer,
      });

      setFiles((prev) => [...prev, uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (id: number) => {
    await window.api.file.delete({ id });
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="h-full flex flex-col gap-8">
      {!isBuilding && (
        <div className="w-full max-w-2xl mx-auto h-9 flex flex-row items-center justify-between">
          <Typography.Heading level="h2">Resume</Typography.Heading>
        </div>
      )}

      {loadingBuilder ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : isBuilding && resume ? (
        <div className="flex-1 min-h-0 border-t border-stone-200 dark:border-stone-800">
          <ResumeProvider initialResume={resume}>
            <ResumeBuilder />
          </ResumeProvider>
        </div>
      ) : (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
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
            <>
              <div className="flex flex-col gap-2">
                <Dropzone
                  onFile={handleFile}
                  onError={setError}
                  disabled={uploading}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
              <BuildButton
                onClick={handleBuild}
                icon={
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="3" y1="9" x2="9" y2="9" />
                  </svg>
                }
                label="Build a versioned resume"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
