'use client';

import { classNames } from '@kin/ui';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { FunctionComponent } from 'react';

import { IconButton } from '../icon-button';

type PropsType = {
  value: string;
  onChange: (html: string) => void;
  onBlur?: (html: string) => void;
  placeholder?: string;
};

export const RichTextEditor: FunctionComponent<PropsType> = ({
  value,
  onChange,
  onBlur,
  placeholder,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
      }),
      ...(placeholder ? [Placeholder.configure({ placeholder })] : []),
    ],
    content: value,
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
    onBlur: ({ editor: instance }) => {
      onBlur?.(instance.getHTML());
    },
    editorProps: {
      attributes: {
        class: classNames(
          'min-h-[80px] px-2 py-1.5 text-sm focus:outline-none',
          'text-stone-800 dark:text-stone-200',
          '[&_ul]:list-disc [&_ul]:pl-4',
          '[&_p]:leading-relaxed [&_p+p]:mt-1',
        ),
      },
    },
  });

  if (!editor) return null;

  return (
    <div
      className={classNames(
        'w-full p-2 border rounded-md shadow-xs',
        'transition-all duration-300 ease-in-out',
        'bg-stone-50 border-stone-200',
        'dark:bg-stone-950 dark:border-stone-800',
        'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
      )}
    >
      <EditorContent editor={editor} />
      <div className="flex flex-row items-center px-1 pb-1 pt-2">
        <IconButton
          icon="bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <IconButton
          icon="italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <IconButton
          icon="list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
      </div>
    </div>
  );
};
