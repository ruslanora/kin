import type { InterviewType } from '@kin/desktop/main/database';
import {
  Button,
  createModal,
  DatePicker,
  Modal,
  RichTextEditor,
  TextInput,
  TimePicker,
  Toggle,
  Typography,
} from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import { useJob } from './context';
import { formatScheduledAt, toDateString, toTimeString } from './utils';

type FormType = {
  date: string;
  time: string;
  round: string;
  note: string;
  followUp: boolean;
};

const EMPTY_FORM: FormType = {
  date: '',
  time: '',
  round: '',
  note: '',
  followUp: true,
};

export const Interviews: FunctionComponent = () => {
  const { job } = useJob();
  const modal = createModal();

  const [interviews, setInterviews] = useState<Array<InterviewType>>([]);
  const [selected, setSelected] = useState<InterviewType | null>(null);
  const [form, setForm] = useState<FormType>(EMPTY_FORM);

  useEffect(() => {
    (async () => {
      await window.api.interview
        .getByJob({ jobId: job.id })
        .then(setInterviews);
    })();
  }, [job.id]);

  const openCreate = () => {
    setSelected(null);
    setForm(EMPTY_FORM);

    modal.open();
  };

  const openEdit = (interview: InterviewType) => {
    const d = new Date(interview.scheduledAt);

    setSelected(interview);

    setForm({
      date: toDateString(d),
      time: toTimeString(d),
      round: interview.round ?? '',
      note: interview.note ?? '',
      followUp: interview.followUp,
    });

    modal.open();
  };

  const save = async () => {
    const scheduledAt = new Date(
      `${form.date}T${form.time || '00:00'}`,
    ).getTime();

    if (selected) {
      const updated = await window.api.interview.update({
        id: selected.id,
        scheduledAt,
        round: form.round || null,
        note: form.note || null,
        followUp: form.followUp,
      });

      setInterviews(interviews.map((i) => (i.id === updated.id ? updated : i)));
    } else {
      const created = await window.api.interview.create({
        jobId: job.id,
        scheduledAt,
        round: form.round || null,
        note: form.note || null,
        followUp: form.followUp,
      });

      setInterviews([created, ...interviews]);
    }
    modal.close();
  };

  const remove = async () => {
    if (!selected) return;

    await window.api.interview.delete({ id: selected.id });
    setInterviews(interviews.filter((i) => i.id !== selected.id));

    modal.close();
  };

  return (
    <>
      <div className="w-full flex flex-col items-stretch justify-start gap-8">
        <div className="w-full h-9 flex flex-row items-center justify-between">
          <Typography.Heading level="h2">Interviews</Typography.Heading>
          <Button type="button" style="secondary" onClick={openCreate}>
            Add Interview
          </Button>
        </div>
        {interviews.length > 0 && (
          <div className="flex flex-col divide-y divide-stone-200 dark:divide-stone-800">
            {interviews.map((interview) => (
              <button
                key={interview.id}
                type="button"
                className="w-full flex flex-col items-start gap-0.5 py-3 first:pt-0 text-left hover:opacity-70 transition-opacity cursor-pointer"
                onClick={() => openEdit(interview)}
              >
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  {formatScheduledAt(interview.scheduledAt)}
                </span>
                {interview.round && (
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {interview.round}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal {...modal}>
        <Modal.Header>
          {selected ? 'Edit Interview' : 'New Interview'}
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              value={form.date}
              setValue={(date: string) => setForm({ ...form, date })}
            />
            <TimePicker
              value={form.time}
              setValue={(time: string) => setForm({ ...form, time })}
            />
            <div className="col-span-2">
              <TextInput
                placeholder="Round"
                value={form.round}
                setValue={(round) => setForm({ ...form, round })}
              />
            </div>
            <div className="col-span-2">
              <RichTextEditor
                placeholder="Notes"
                value={form.note}
                onChange={(note) => setForm({ ...form, note })}
              />
            </div>
            <div className="col-span-2">
              <Toggle
                label="Remind me to Follow Up"
                helper="We'll add an event to your calendar one week after the interview as a reminder to follow up."
                checked={form.followUp}
                onChange={(followUp) => setForm({ ...form, followUp })}
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
            disabled={!form.date}
            onClick={save}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
