import type {
  ResumeContentType,
  ResumeSectionType,
} from '@kin/desktop/main/database';
import { Button, classNames, Icon, IconButton, TextInput } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { useResume } from './context';
import { CategoryRecord } from './records/category-record';
import { ListRecord } from './records/list-record';
import { PeriodRecord } from './records/period-record';

type SectionWithContentsType = ResumeSectionType & {
  contents: ResumeContentType[];
};

type PropsType = {
  section: SectionWithContentsType;
  isReordering: boolean;
};

export const SectionItem: FunctionComponent<PropsType> = ({
  section,
  isReordering,
}) => {
  const {
    patchSection,
    updateSection,
    deleteSection,
    addContent,
    reorderContents,
  } = useResume();

  const [name, setName] = useState(section.name ?? '');
  const [dragContentId, setDragContentId] = useState<number | null>(null);
  const [dragOverContentId, setDragOverContentId] = useState<number | null>(
    null,
  );

  const handleNameChange = (value: string) => {
    setName(value);
    patchSection(section.id, { name: value });
  };

  const handleNameBlur = () => {
    updateSection(section.id, { name });
  };

  const handleToggleVisibility = () => {
    updateSection(section.id, { isVisible: !section.isVisible });
  };

  const handleDelete = async () => {
    await deleteSection(section.id);
  };

  const handleAddRecord = async () => {
    await addContent(section.id, section.contentType);
  };

  const handleContentDragStart = (e: React.DragEvent, id: number) => {
    e.stopPropagation();
    setDragContentId(id);
  };

  const handleContentDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (dragContentId !== id) {
      setDragOverContentId(id);
    }
  };

  const handleContentDrop = (e: React.DragEvent, targetId: number) => {
    e.stopPropagation();
    if (dragContentId === null || dragContentId === targetId) {
      setDragOverContentId(null);
      return;
    }

    const ids = section.contents.map((c) => c.id);
    const fromIdx = ids.indexOf(dragContentId);
    const toIdx = ids.indexOf(targetId);
    const reordered = [...ids];

    reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, dragContentId);

    reorderContents(section.id, reordered);
    setDragContentId(null);
    setDragOverContentId(null);
  };

  const handleContentDragEnd = () => {
    setDragContentId(null);
    setDragOverContentId(null);
  };

  const getContentTitle = (content: ResumeContentType) => {
    return content.title || content.subtitle;
  };

  if (isReordering) {
    return (
      <div className="flex flex-col items-stretch justify-start overflow-hidden">
        <div className="flex flex-row items-center gap-4 p-4 cursor-grab">
          <span className="text-stone-400 shrink-0">
            <Icon name="move" size={14} />
          </span>
          <span className="text-sm font-semibold text-stone-950 dark:text-stone-50 truncate">
            {section.name}
          </span>
        </div>
        {section.contentType !== 'list' &&
          section.contents.map((content) => (
            <div
              key={content.id}
              draggable
              onDragStart={(e) => handleContentDragStart(e, content.id)}
              onDragOver={(e) => handleContentDragOver(e, content.id)}
              onDrop={(e) => handleContentDrop(e, content.id)}
              onDragEnd={handleContentDragEnd}
              className={classNames(
                'flex flex-row items-center gap-4 p-4 pl-8 rounded-sm cursor-grab',
                'transition-opacity duration-150',
                dragContentId === content.id && 'opacity-40',
                dragOverContentId === content.id &&
                  'ring-2 ring-inset ring-blue-400 dark:ring-blue-600',
              )}
            >
              <span className="text-stone-400 shrink-0">
                <Icon name="move" size={14} />
              </span>
              <span className="text-sm text-stone-700 dark:text-stone-300 truncate">
                {getContentTitle(content)}
              </span>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-6 pb-0 border-t border-stone-200 dark:border-stone-800">
      <div className="flex flex-row items-center gap-2">
        <div
          className={classNames(
            'flex-1 min-w-0',
            !section.isVisible && 'opacity-40',
          )}
        >
          <TextInput
            label="Section Name"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
          />
        </div>
        <IconButton
          icon={section.isVisible ? 'eye' : 'eyeOff'}
          onClick={handleToggleVisibility}
        />
        <IconButton icon="trash" onClick={handleDelete} />
      </div>

      {section.contents.length > 0 && (
        <div
          className={classNames(
            'flex flex-col gap-2 mt-1 transition-opacity duration-200',
            !section.isVisible && 'opacity-40',
          )}
        >
          {section.contents.map((content) => (
            <div key={content.id}>
              {section.contentType === 'period' && (
                <PeriodRecord content={content} />
              )}
              {section.contentType === 'category' && (
                <CategoryRecord content={content} />
              )}
              {section.contentType === 'list' && (
                <ListRecord content={content} />
              )}
            </div>
          ))}
        </div>
      )}

      {section.contentType !== 'list' && (
        <div className="w-full flex items-center justify-end">
          <Button type="button" style="secondary" onClick={handleAddRecord}>
            Add Record
          </Button>
        </div>
      )}
    </div>
  );
};
