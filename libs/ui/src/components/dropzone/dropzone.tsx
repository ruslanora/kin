'use client';

import { classNames } from '@kin/ui/utils';
import {
  type DragEvent,
  type FunctionComponent,
  useRef,
  useState,
} from 'react';

import { Icon } from '../icon';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const ACCEPTED_EXTENSIONS = '.pdf,.docx,.txt';

type PropsType = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export const Dropzone: FunctionComponent<PropsType> = ({
  onFile,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (
      ACCEPTED_TYPES.includes(file.type) ||
      file.name.match(/\.(pdf|docx|txt)$/i)
    ) {
      onFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = () => {
    const file = inputRef.current?.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) =>
        e.key === 'Enter' && !disabled && inputRef.current?.click()
      }
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={classNames(
        'flex flex-col items-center justify-center gap-3',
        'w-full min-h-32 px-6 py-8 rounded-xl border-2 border-dashed',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
        !disabled && 'cursor-pointer',
        !isDragging &&
          !disabled &&
          'border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600',
        isDragging &&
          'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20',
        disabled &&
          'border-stone-100 dark:border-stone-900 opacity-50 cursor-not-allowed',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <span
        className={classNames(
          'text-stone-400 dark:text-stone-500',
          isDragging && 'text-blue-500 dark:text-blue-400',
        )}
      >
        <Icon name="upload" size={24} />
      </span>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
          {isDragging ? 'Drop file here' : 'Drop file or click to browse'}
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-500">
          PDF, DOCX, or TXT
        </p>
      </div>
    </div>
  );
};
