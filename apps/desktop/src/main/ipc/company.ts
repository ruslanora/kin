import { asc, eq } from 'drizzle-orm';

import { getDb } from '../database/client';
import { companies } from '../database/schema';
import { handle } from './handle';

export const registerCompanyHandlers = (): void => {
  handle('company:getAll', (_event) => {
    const db = getDb();
    return db.select().from(companies).orderBy(asc(companies.name)).all();
  });

  handle('company:getById', (_event, { id }: { id: number }) => {
    const db = getDb();
    return db.select().from(companies).where(eq(companies.id, id)).get();
  });

  handle(
    'company:update',
    (
      _event,
      {
        id,
        ...fields
      }: Partial<typeof companies.$inferInsert> & { id: number },
    ) => {
      const db = getDb();

      const cleanFields = Object.fromEntries(
        Object.entries(fields).filter(([, v]) => v !== undefined),
      );

      if (Object.keys(cleanFields).length === 0) {
        return db.select().from(companies).where(eq(companies.id, id)).get();
      }

      return db
        .update(companies)
        .set(cleanFields)
        .where(eq(companies.id, id))
        .returning()
        .get();
    },
  );
};
