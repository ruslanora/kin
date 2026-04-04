import { Button, createModal, Modal, Typography } from '@kin/ui';
import { type FunctionComponent, useState } from 'react';

export const DataControlSection: FunctionComponent = () => {
  const modal = createModal();
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [deletionLoading, setDeletionLoading] = useState<boolean>(false);

  const handleOnDelete = async () => {
    setDeletionLoading(true);
    await window.api.data.flush();
    setDeletionLoading(false);
    modal.close();
  };

  const handleOnExport = async () => {
    setExportLoading(true);
    await window.api.data.export();
    setExportLoading(false);
  };

  return (
    <>
      <section className="flex flex-col items-stretch justify-start gap-8">
        <Typography.Heading level="h2">Data Control</Typography.Heading>
        <Typography.Paragraph>
          Your data never leaves your device without your permission. Stay in
          full control.
        </Typography.Paragraph>
        <div className="flex flex-row items-start justify-start gap-4">
          <Button
            style="secondary"
            onClick={handleOnExport}
            loading={exportLoading}
          >
            Export Your Data
          </Button>
          <Button style="danger" onClick={modal.open}>
            Delete Your Data
          </Button>
        </div>
      </section>

      <Modal state={modal.state} open={modal.open} close={modal.close}>
        <Modal.Header>Delete Your Data</Modal.Header>
        <Modal.Body>
          This will permanently delete all your resumes, job boards, companies,
          contacts, and interviews. This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button style="secondary" onClick={modal.close}>
            Cancel
          </Button>
          <Button
            style="danger"
            loading={deletionLoading}
            onClick={handleOnDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
