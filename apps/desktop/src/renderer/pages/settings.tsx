import {
  Button,
  CardButton,
  classNames,
  createModal,
  Icon,
  Modal,
  Toggle,
  Typography,
} from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import { useFocusRing, useTheme } from '../hooks';
import { PageContainer } from './container';

export const SettingsPage: FunctionComponent = () => {
  const { focusRing, setFocusRing } = useFocusRing();
  const { theme, setTheme } = useTheme();
  const modal = createModal();
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [deletionLoading, setDeletionLoading] = useState<boolean>(false);
  const [calendarPermission, setCalendarPermission] = useState<string | null>(
    null,
  );

  useEffect(() => {
    window.api.calendar.getPermissionStatus().then((status) => {
      setCalendarPermission(status);
    });
  }, []);

  const handleOnExport = async () => {
    setExportLoading(true);
    await window.api.data.export();
    setExportLoading(false);
  };

  const handleOnConnectCalendar = async () => {
    const status = await window.api.calendar.requestPermission();
    setCalendarPermission(status);
  };

  const handleOnDelete = async () => {
    setDeletionLoading(true);
    await window.api.data.flush();
    setDeletionLoading(false);

    modal.close();
  };

  return (
    <PageContainer
      canGoBack
      panel={<Typography.Heading as="h2">Settings</Typography.Heading>}
    >
      <div className="overflow-y-auto">
        <div
          className={classNames(
            'flex flex-col items-stretch justify-start gap-8 px-8',
            'w-full max-w-1/2 mx-auto',
          )}
        >
          <section className="flex flex-col items-stretch justify-start gap-4">
            <Typography.Heading level="h2">Accessibility</Typography.Heading>
            <div className="mt-4">
              <Toggle
                label="Focus rings"
                helper="Show focus rings and outlines on interactive elements when navigating with a keyboard."
                checked={focusRing}
                onChange={setFocusRing}
              />
            </div>
          </section>
          <section className="flex flex-col items-stretch justify-start gap-4">
            <Typography.Heading level="h2">Color Mode</Typography.Heading>
            <Typography.Paragraph></Typography.Paragraph>
            <ul className="flex flex-row items-center justify-start gap-4">
              <li>
                <CardButton
                  label="Light"
                  isActive={theme === 'light'}
                  onClick={() => setTheme('light')}
                >
                  <Icon name="sun" size={24} />
                </CardButton>
              </li>
              <li>
                <CardButton
                  label="Dark"
                  isActive={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                >
                  <Icon name="moon" size={24} />
                </CardButton>
              </li>
              <li>
                <CardButton
                  label="System"
                  isActive={theme === 'system'}
                  onClick={() => setTheme('system')}
                >
                  <Icon name="monitor" size={24} />
                </CardButton>
              </li>
            </ul>
          </section>
          <section className="flex flex-col items-stretch justify-start gap-4">
            <Typography.Heading level="h2">Synchronization</Typography.Heading>
            <Typography.Heading level="h3">Calendar</Typography.Heading>
            <Typography.Paragraph>
              Sync your scheduled interviews with macOS Calendar so they appear
              alongside your other events on all your Apple devices.
            </Typography.Paragraph>
            {calendarPermission === 'authorized' ? (
              <Button style="secondary" disabled>
                Already in Sync
              </Button>
            ) : (
              <Button style="secondary" onClick={handleOnConnectCalendar}>
                Connect Calendar
              </Button>
            )}
          </section>
          <section className="flex flex-col items-stretch justify-start gap-4">
            <Typography.Heading level="h2">Data Control</Typography.Heading>
            <Typography.Paragraph>
              Your data never leaves your device without your permission. Stay
              in full control.
            </Typography.Paragraph>
            <div className="flex flex-row items-start justify-start gap-4">
              <Button
                style="secondary"
                loading={exportLoading}
                onClick={handleOnExport}
              >
                Export Your Data
              </Button>
              <Button style="danger" onClick={modal.open}>
                Delete Your Data
              </Button>
            </div>
          </section>
        </div>
      </div>

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
    </PageContainer>
  );
};
