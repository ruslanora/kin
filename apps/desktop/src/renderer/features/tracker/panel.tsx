import {
  Button,
  createModal,
  IconButton,
  Modal,
  Select,
  Typography,
} from '@kin/ui';
import type { FunctionComponent } from 'react';

import { useTracker } from './context';
import { JobModal } from './job-modal';
import { boardLabel } from './utils';

export const TrackerPanel: FunctionComponent = () => {
  const archiveModal = createModal();
  const jobModal = createModal();

  const {
    editing,
    setEditing,
    board,
    activeBoard,
    archivedBoards,
    switchBoard,
    archiveBoard,
    addColumn,
  } = useTracker();

  const isActiveBoard = board.id === activeBoard.id;

  const handleArchive = async () => {
    await archiveBoard();
    archiveModal.close();
  };

  return (
    <>
      <div className="w-full flex flex-row flex-nowrap items-center justify-between">
        <div className="flex flex-row flex-nowrap items-center justify-start gap-2">
          <Typography.Heading as="h2">Job Tracker</Typography.Heading>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          {isActiveBoard && (
            <IconButton
              icon={editing ? 'save' : 'sliders'}
              onClick={() => setEditing(!editing)}
            />
          )}
          {editing ? (
            <Button
              type="button"
              style="primary"
              onClick={() => addColumn('New Column')}
            >
              Add Column
            </Button>
          ) : (
            <>
              {isActiveBoard && (
                <>
                  <Button type="button" style="primary" onClick={jobModal.open}>
                    Add Job
                  </Button>
                  <Button
                    type="button"
                    style="secondary"
                    onClick={archiveModal.open}
                  >
                    Archive Board
                  </Button>
                </>
              )}
              <Select
                selected={board.id}
                setSelected={(id) =>
                  id !== null && id !== undefined && switchBoard(Number(id))
                }
                options={[
                  {
                    name: boardLabel(activeBoard, true),
                    value: activeBoard.id,
                  },
                  ...archivedBoards.map((board) => ({
                    name: boardLabel(board, false),
                    value: board.id,
                  })),
                ]}
              />
            </>
          )}
        </div>
      </div>
      <Modal
        state={archiveModal.state}
        open={archiveModal.open}
        close={archiveModal.close}
      >
        <Modal.Header>Archive Board</Modal.Header>
        <Modal.Body>
          Are you sure you want to archive this board? A new board will be
          created automatically.
        </Modal.Body>
        <Modal.Footer>
          <Button style="secondary" onClick={archiveModal.close}>
            Cancel
          </Button>
          <Button style="primary" onClick={handleArchive}>
            Archive
          </Button>
        </Modal.Footer>
      </Modal>

      <JobModal modalControl={jobModal} />
    </>
  );
};
