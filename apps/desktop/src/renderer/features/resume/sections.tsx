import {
  Button,
  classNames,
  createModal,
  Icon,
  IconButton,
  Typography,
} from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { AddSectionModal } from './add-section-modal';
import { useResume } from './context';
import { SectionItem } from './section-item';

export const ResumeSections: FunctionComponent = () => {
  const { resume, reorderSections } = useResume();
  const addModal = createModal();

  const [isReordering, setIsReordering] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  if (!resume) return null;

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDragId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    if (dragId !== id) setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    if (dragId === null || dragId === targetId) {
      setDragOverId(null);
      return;
    }

    const ids = resume.sections.map((s) => s.id);
    const fromIdx = ids.indexOf(dragId);
    const toIdx = ids.indexOf(targetId);
    const reordered = [...ids];

    reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, dragId);

    reorderSections(reordered);
    setDragId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Typography.Heading level="h2" as="h1">
          Sections
        </Typography.Heading>
        <IconButton
          icon={isReordering ? 'check' : 'move2'}
          onClick={() => setIsReordering((v) => !v)}
        />
      </div>

      {resume.sections.map((section) => (
        <div
          key={section.id}
          draggable={isReordering}
          onDragStart={
            isReordering ? (e) => handleDragStart(e, section.id) : undefined
          }
          onDragOver={
            isReordering ? (e) => handleDragOver(e, section.id) : undefined
          }
          onDrop={isReordering ? (e) => handleDrop(e, section.id) : undefined}
          onDragEnd={isReordering ? handleDragEnd : undefined}
          className={classNames(
            isReordering && 'rounded-sm transition-opacity duration-150',
            isReordering && dragId === section.id && 'opacity-40',
            isReordering &&
              dragOverId === section.id &&
              'ring-2 ring-blue-400 dark:ring-blue-600',
          )}
        >
          <SectionItem section={section} isReordering={isReordering} />
        </div>
      ))}

      {!isReordering && (
        <Button
          type="button"
          style="primary"
          width="full"
          onClick={addModal.open}
        >
          <Icon name="plus" size={18} />
          <span>Add Section</span>
        </Button>
      )}

      <AddSectionModal modal={addModal} />
    </div>
  );
};
