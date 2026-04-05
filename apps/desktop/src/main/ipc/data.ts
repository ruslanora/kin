import { app, dialog } from 'electron';
import { copyFile, rm } from 'fs/promises';
import path from 'path';

import { getDb } from '../database/client';
import {
  boards,
  columns,
  companies,
  contacts,
  files,
  interviews,
  jobContacts,
  jobs,
} from '../database/schema';
import { handle } from './handle';

export const registerDataHandlers = (): void => {
  handle('data:export', async () => {
    const dbPath = path.join(app.getPath('userData'), 'jobtracker.db');

    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'Export Your Data',
      defaultPath: path.join(app.getPath('downloads'), 'kin-export.db'),
      filters: [{ name: 'SQLite Database', extensions: ['db'] }],
    });

    if (canceled || !filePath) return;

    await copyFile(dbPath, filePath);
  });

  handle('data:flush', async () => {
    const db = getDb();
    const filesDir = path.join(app.getPath('userData'), 'files');

    db.transaction((tx) => {
      tx.delete(interviews).run();
      tx.delete(jobContacts).run();
      tx.delete(files).run();
      tx.delete(jobs).run();
      tx.delete(columns).run();
      tx.delete(boards).run();
      tx.delete(contacts).run();
      tx.delete(companies).run();
    });

    await rm(filesDir, { recursive: true, force: true });
  });
};
