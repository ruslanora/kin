import type { ColumnType } from '@kin/desktop/main/database/schema';
import { Button, createModal, IconButton, Modal } from '@kin/ui';
import { classNames } from '@kin/ui/utils';
import { Reorder, useDragControls } from 'framer-motion';
import { type FunctionComponent, useMemo, useState } from 'react';

import { Card } from './card';
import { useTracker } from './context';

type PropsType = {
  column: ColumnType;
};

export const Column: FunctionComponent<PropsType> = ({ column }) => {
  const dragControls = useDragControls();
  const { editing, updateColumn, deleteColumn, jobs } = useTracker();

  const columnJobs = useMemo(
    () =>
      jobs
        .filter((job) => job.columnId === column.id)
        .sort((a, b) => a.order - b.order),
    [jobs, column.id],
  );

  const deleteModal = createModal();

  const [name, setName] = useState(column.name);
  const [isCardDragging, setIsCardDragging] = useState(false);

  const handleRename = (): void => {
    const trimmed = name.trim();

    if (trimmed && trimmed !== column.name) {
      updateColumn(column.id, trimmed);
    } else {
      setName(column.name);
    }
  };

  const handleDelete = () => {
    deleteColumn(column.id);
    deleteModal.close();
  };

  return (
    <Reorder.Item
      value={column}
      dragListener={false}
      dragControls={dragControls}
      className={classNames(
        'flex flex-col shrink-0 w-64 self-stretch',
        isCardDragging ? 'z-20' : '',
      )}
    >
      <div className="flex flex-col h-full rounded-xl bg-stone-100 dark:bg-stone-900">
        <div className="flex flex-row items-center justify-between p-2 gap-2">
          {editing ? (
            <input
              className={classNames(
                'h-9 flex-1 min-w-0 bg-transparent outline-none pl-2',
                'text-sm font-medium text-stone-800 dark:text-stone-100',
                'border-b border-stone-300 dark:border-stone-600',
                'focus:border-stone-500 dark:focus:border-stone-400',
                'py-0.5',
              )}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                } else if (e.key === 'Escape') {
                  setName(column.name);
                  e.currentTarget.blur();
                }
              }}
            />
          ) : (
            <div className="w-full h-9 flex items-center justify-start pl-2">
              <span className="min-w-0 text-sm font-medium text-stone-800 dark:text-stone-100 truncate">
                {column.name}
              </span>
            </div>
          )}

          {editing && (
            <div className="flex flex-row items-center shrink-0">
              <IconButton icon="trash" onClick={deleteModal.open} />
              <div
                onPointerDown={(e) => dragControls?.start(e)}
                className="cursor-grab active:cursor-grabbing"
              >
                <IconButton icon="move" onClick={() => {}} />
              </div>
            </div>
          )}
        </div>

        <div
          className={classNames(
            'flex flex-col gap-2 flex-1 p-2 pt-0',
            isCardDragging ? 'overflow-visible' : 'overflow-y-auto',
          )}
          data-column-id={column.id}
        >
          {columnJobs.map((job) => (
            <Card
              key={job.id}
              job={job}
              onDragStart={() => setIsCardDragging(true)}
              onDragEnd={() => setIsCardDragging(false)}
            />
          ))}
        </div>
      </div>
      <Modal
        state={deleteModal.state}
        open={deleteModal.open}
        close={deleteModal.close}
      >
        <Modal.Header>Delete Column</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the column? All jobs in the column
          will also be deleted.
        </Modal.Body>
        <Modal.Footer>
          <Button style="secondary" onClick={deleteModal.close}>
            Cancel
          </Button>
          <Button style="primary" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Reorder.Item>
  );
};
