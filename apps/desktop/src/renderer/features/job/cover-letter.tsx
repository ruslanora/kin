import type {
  CoverLetterType,
  FileType,
  ResumeWithSectionsType,
} from '@kin/desktop/main/database';
import { Dropzone, File, Spinner, Typography } from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import {
  CoverLetterBuilder,
  CoverLetterProvider,
} from '../builders/cover-letter';
import { ResumeProvider } from '../builders/resume';
import { BuildButton } from './build-button';
import { useJob } from './context';

export const CoverLetter: FunctionComponent = () => {
  const { job, updateJob } = useJob();

  const isBuilding = job.coverLetterId != null;

  const [files, setFiles] = useState<Array<FileType>>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeWithSectionsType | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterType | null>(null);
  const [loadingBuilder, setLoadingBuilder] = useState(false);

  useEffect(() => {
    if (!isBuilding) {
      (async () => {
        const all = await window.api.file.getByJob({
          jobId: job.id,
          fileType: 'cover_letter',
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
          const cl = await window.api.coverLetter.getOrCreateForResume({
            resumeId: job.resumeId!,
          });

          setResume(r);
          setCoverLetter(cl);
        } finally {
          setLoadingBuilder(false);
        }
      })();
    }
  }, [isBuilding, job.resumeId]);

  const handleBuild = async () => {
    setLoadingBuilder(true);
    try {
      let resumeId = job.resumeId;

      if (resumeId == null) {
        const forked = await window.api.resume.fork();
        resumeId = forked.id;

        await updateJob({ resumeId });
        setResume(forked);
      } else {
        const r = await window.api.resume.getById({ id: resumeId });
        setResume(r);
      }

      const cl = await window.api.coverLetter.getOrCreateForResume({
        resumeId,
      });

      await updateJob({ coverLetterId: cl.id });
      setCoverLetter(cl);
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
    <div className="h-full flex flex-col gap-8">
      {!isBuilding && (
        <div className="w-full max-w-2xl mx-auto h-9 flex flex-row items-center justify-between">
          <Typography.Heading level="h2">Cover Letter</Typography.Heading>
        </div>
      )}

      {loadingBuilder ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : isBuilding && resume && coverLetter ? (
        <div className="flex-1 min-h-0 border-t border-stone-200 dar:border-stone-800">
          <ResumeProvider initialResume={resume}>
            <CoverLetterProvider initialCoverLetter={coverLetter}>
              <CoverLetterBuilder />
            </CoverLetterProvider>
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                }
                label="Build a versioned cover letter"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
