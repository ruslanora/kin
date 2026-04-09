import type { CompanyType } from '@kin/desktop/main/database';
import { Button, classNames, Modal, RichTextEditor, TextInput } from '@kin/ui';
import { type FunctionComponent, useEffect, useMemo, useState } from 'react';

import { useTracker } from './context';

type PropsType = {
  modalControl: {
    state: boolean;
    open: () => void;
    close: () => void;
  };
};

export const JobModal: FunctionComponent<PropsType> = ({ modalControl }) => {
  const { jobs, addJob } = useTracker();

  const [companyName, setCompanyName] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [companies, setCompanies] = useState<CompanyType[]>([]);

  useEffect(() => {
    window.api.company.getAll().then(setCompanies);
  }, []);

  const trimmedCompany = companyName.trim();
  const trimmedPosition = position.trim();

  const existingJob = useMemo(() => {
    if (!trimmedCompany) return null;
    const normalized = trimmedCompany.toLowerCase();
    return (
      jobs.find((job) => job.companyName.toLowerCase() === normalized) ?? null
    );
  }, [trimmedCompany, jobs]);

  const avoidedCompany = useMemo(() => {
    if (!trimmedCompany) return null;

    const normalized = trimmedCompany.toLowerCase();

    return (
      companies.find(
        (c) => c.isToAvoid && c.name.toLowerCase() === normalized,
      ) ?? null
    );
  }, [trimmedCompany, companies]);

  const reset = () => {
    setCompanyName('');
    setPosition('');
    setDescription('');
    setUrl('');
  };

  const close = () => {
    reset();
    modalControl.close();
  };

  const submit = async () => {
    if (!trimmedCompany || !trimmedPosition) return;

    setLoading(true);
    try {
      await addJob({
        companyName: trimmedCompany,
        title: trimmedPosition,
        description: description.trim() || undefined,
        url: url.trim() || undefined,
      });
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal state={modalControl.state} open={modalControl.open} close={close}>
      <Modal.Header>Add Job</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <TextInput
            label="Company *"
            value={companyName}
            onChange={setCompanyName}
          />
          {avoidedCompany && (
            <p
              className={classNames(
                'text-sm',
                'text-red-600 dark:text-red-400',
              )}
            >
              This company is marked as one to avoid.
            </p>
          )}
          {!avoidedCompany && existingJob && (
            <div
              className={classNames(
                'flex flex-row items-center gap-1 text-sm',
                'text-amber-600 dark:text-amber-400',
              )}
            >
              <span>You&apos;ve already applied to this company.</span>
              <button
                type="button"
                className="underline underline-offset-2 whitespace-nowrap cursor-pointer"
                onClick={close}
              >
                See job &rarr;
              </button>
            </div>
          )}
          <TextInput
            label="Position *"
            value={position}
            onChange={setPosition}
          />
          <RichTextEditor
            placeholder="Description"
            value={description}
            onChange={setDescription}
          />
          <TextInput label="http://" value={url} onChange={setUrl} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" style="secondary" onClick={close}>
          Cancel
        </Button>
        <Button
          type="button"
          style="primary"
          onClick={submit}
          loading={loading}
          disabled={!trimmedCompany || !trimmedPosition || !!avoidedCompany}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
