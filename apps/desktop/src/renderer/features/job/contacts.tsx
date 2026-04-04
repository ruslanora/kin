import type { ContactType } from '@kin/desktop/main/database';
import {
  Button,
  createModal,
  Modal,
  RichTextEditor,
  TextInput,
  Typography,
} from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import { useJob } from './context';

type FormType = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  linkedin: string;
  note: string;
};

const EMPTY_FORM: FormType = {
  firstName: '',
  lastName: '',
  title: '',
  email: '',
  linkedin: '',
  note: '',
};

export const Contacts: FunctionComponent = () => {
  const { job } = useJob();
  const modal = createModal();

  const [contacts, setContacts] = useState<Array<ContactType>>([]);
  const [selected, setSelected] = useState<ContactType | null>(null);
  const [form, setForm] = useState<FormType>(EMPTY_FORM);

  useEffect(() => {
    (async () => {
      await window.api.contact.getByJob({ jobId: job.id }).then(setContacts);
    })();
  }, [job.id]);

  const openCreate = () => {
    setSelected(null);
    setForm(EMPTY_FORM);

    modal.open();
  };

  const openEdit = (contact: ContactType) => {
    setSelected(contact);

    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      title: contact.title ?? '',
      email: contact.email ?? '',
      linkedin: contact.linkedin ?? '',
      note: contact.note ?? '',
    });

    modal.open();
  };

  const save = async () => {
    if (selected) {
      const updated = await window.api.contact.update({
        id: selected.id,
        firstName: form.firstName,
        lastName: form.lastName,
        title: form.title || null,
        email: form.email || null,
        linkedin: form.linkedin || null,
        note: form.note || null,
      });

      setContacts(contacts.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created = await window.api.contact.create({
        jobId: job.id,
        firstName: form.firstName,
        lastName: form.lastName,
        title: form.title || null,
        email: form.email || null,
        linkedin: form.linkedin || null,
        note: form.note || null,
      });

      setContacts([created, ...contacts]);
    }
    modal.close();
  };

  const remove = async () => {
    if (!selected) return;

    await window.api.contact.delete({ id: selected.id });
    setContacts(contacts.filter((c) => c.id !== selected.id));

    modal.close();
  };

  return (
    <>
      <div className="w-full flex flex-col items-stretch justify-start gap-8">
        <div className="w-full h-9 flex flex-row items-center justify-between">
          <Typography.Heading level="h2">Contacts</Typography.Heading>
          <Button type="button" style="secondary" onClick={openCreate}>
            Add Contact
          </Button>
        </div>
        {contacts.length > 0 && (
          <div className="flex flex-col divide-y divide-stone-200 dark:divide-stone-800">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                className="w-full flex flex-col items-start gap-0.5 py-3 first:pt-0 text-left hover:opacity-70 transition-opacity cursor-pointer"
                onClick={() => openEdit(contact)}
              >
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  {contact.firstName} {contact.lastName}
                </span>
                {contact.title && (
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {contact.title}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal {...modal}>
        <Modal.Header>{selected ? 'Edit Contact' : 'New Contact'}</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              placeholder="First Name *"
              value={form.firstName}
              setValue={(firstName) => setForm({ ...form, firstName })}
            />
            <TextInput
              placeholder="Last Name *"
              value={form.lastName}
              setValue={(lastName) => setForm({ ...form, lastName })}
            />
            <div className="col-span-2">
              <TextInput
                placeholder="Title"
                value={form.title}
                setValue={(title) => setForm({ ...form, title })}
              />
            </div>
            <TextInput
              placeholder="Email"
              value={form.email}
              setValue={(email) => setForm({ ...form, email })}
            />
            <TextInput
              placeholder="LinkedIn"
              value={form.linkedin}
              setValue={(linkedin) => setForm({ ...form, linkedin })}
            />
            <div className="col-span-2">
              <RichTextEditor
                placeholder="Notes"
                value={form.note}
                onChange={(note) => setForm({ ...form, note })}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {selected && (
            <Button type="button" style="danger" onClick={remove}>
              Delete
            </Button>
          )}
          <Button type="button" style="secondary" onClick={modal.close}>
            Cancel
          </Button>
          <Button
            type="button"
            style="primary"
            disabled={!form.firstName.trim() || !form.lastName.trim()}
            onClick={save}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
