import { isNull } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { app } from 'electron';
import * as path from 'path';

import { getDb } from './client';
import { boards, columns } from './schema';

export const runMigrations = (): void => {
  const db = getDb();

  const migrationsFolder = app.isPackaged
    ? path.join(process.resourcesPath, 'migrations')
    : path.join(app.getAppPath(), 'src/main/database/migrations');

  migrate(db, { migrationsFolder });
};

const DEFAULT_COLUMNS = [
  'Bookmarked',
  'Applied',
  'Screening Call',
  'Interviewing',
  'Offer Accepted',
  'Ghosted',
  'Rejected',
];

export const seedDefaults = (): void => {
  const db = getDb();

  const activeBoard = db
    .select()
    .from(boards)
    .where(isNull(boards.archivedAt))
    .limit(1)
    .get();

  if (!activeBoard) {
    db.transaction((tx) => {
      const board = tx
        .insert(boards)
        .values({ name: 'New Job Hunt', createdAt: new Date() })
        .returning()
        .get();
      DEFAULT_COLUMNS.forEach((name, order) => {
        tx.insert(columns).values({ boardId: board.id, name, order }).run();
      });
    });
  }
};

export const nextOrderFor = (items: Array<{ order: number }>): number => {
  return items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 0;
};
