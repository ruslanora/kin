import Database from 'better-sqlite3';
import {
  type BetterSQLite3Database,
  drizzle,
} from 'drizzle-orm/better-sqlite3';
import { app } from 'electron';
import * as path from 'path';

import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>>;

export const getDb = (): BetterSQLite3Database<typeof schema> & {
  $client: Database.Database;
} => {
  if (!db) {
    const dbPath = path.join(app.getPath('userData'), 'jobtracker.db');
    const sqlite = new Database(dbPath);

    sqlite.pragma('journal_mode = WAL');

    db = drizzle(sqlite, { schema });
  }

  return db;
};
