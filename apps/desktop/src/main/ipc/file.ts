import { eq } from 'drizzle-orm';
import { app } from 'electron';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';

import { getDb } from '../database/client';
import { files } from '../database/schema';
import { handle } from './handle';

export const registerFileHandlers = (): void => {
  handle('file:getByJob', (_event, { jobId }: { jobId: number }) => {
    const db = getDb();
    return db.select().from(files).where(eq(files.jobId, jobId)).all();
  });

  handle(
    'file:upload',
    async (
      _event,
      {
        jobId,
        fileType,
        fileName,
        buffer,
      }: {
        jobId: number;
        fileType: 'resume' | 'cover_letter';
        fileName: string;
        buffer: number[];
      },
    ) => {
      const db = getDb();
      const filesDir = path.join(app.getPath('userData'), 'files');
      await mkdir(filesDir, { recursive: true });

      const ext = path.extname(fileName);
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const filePath = path.join(filesDir, uniqueName);

      await writeFile(filePath, Buffer.from(buffer));

      return db
        .insert(files)
        .values({ jobId, fileType, fileName, filePath })
        .returning()
        .get();
    },
  );

  handle('file:delete', async (_event, { id }: { id: number }) => {
    const db = getDb();
    const file = db.select().from(files).where(eq(files.id, id)).get();
    if (file) {
      await unlink(file.filePath).catch(() => {});
      db.delete(files).where(eq(files.id, id)).run();
    }
  });
};
