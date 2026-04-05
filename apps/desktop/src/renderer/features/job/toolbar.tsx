import {
  Button,
  createModal,
  IconButton,
  Modal,
  Rating,
  Select,
  Typography,
} from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useJob } from './context';

export const Toolbar: FunctionComponent = () => {
  const deleteModal = createModal();
  const { job, columns, updateJob, deleteJob } = useJob();
  const navigate = useNavigate();

  const heading = `${job.title ?? '—'} at ${job.companyName}`;

  const handleColumnChange = async (
    value: number | string | null | undefined,
  ) => {
    if (value === null || value === undefined) return;

    const columnId = Number(value);

    if (columnId === job.columnId) return;

    await updateJob({ columnId });
  };

  const handleDelete = async () => {
    await deleteJob();
    navigate('/');
  };

  return (
    <>
      <div className="w-full flex flex-row flex-nowrap items-center justify-between p-4">
        <div className="flex flex-row flex-nowrap items-center justify-start gap-2">
          <IconButton icon="arrow-left" onClick={() => navigate(-1)} />
          <Typography.Heading>{heading}</Typography.Heading>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          <Rating
            value={job.excitement}
            onChange={(excitement) => updateJob({ excitement })}
          />
          <Select
            selected={job.columnId}
            setSelected={handleColumnChange}
            options={columns.map((col) => ({ name: col.name, value: col.id }))}
          />
          <Button type="button" style="danger" onClick={deleteModal.open}>
            Remove Job
          </Button>
        </div>
      </div>
      <Modal
        state={deleteModal.state}
        open={deleteModal.open}
        close={deleteModal.close}
      >
        <Modal.Header>Remove Job</Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{heading}</strong>? This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" style="secondary" onClick={deleteModal.close}>
            Cancel
          </Button>
          <Button type="button" style="danger" onClick={handleDelete}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
