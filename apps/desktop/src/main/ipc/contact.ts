import { asc, desc, eq, getTableColumns } from 'drizzle-orm';

import { getDb } from '../database/client';
import { companies, contacts, jobContacts } from '../database/schema';
import { handle } from './handle';

export const registerContactHandlers = (): void => {
  handle('contact:getAll', (_event) => {
    const db = getDb();

    return db
      .select({
        ...getTableColumns(contacts),
        companyName: companies.name,
      })
      .from(contacts)
      .leftJoin(companies, eq(contacts.companyId, companies.id))
      .orderBy(asc(contacts.lastName), asc(contacts.firstName))
      .all();
  });

  handle('contact:getByJob', (_event, { jobId }: { jobId: number }) => {
    const db = getDb();

    return db
      .select(getTableColumns(contacts))
      .from(contacts)
      .innerJoin(jobContacts, eq(jobContacts.contactId, contacts.id))
      .where(eq(jobContacts.jobId, jobId))
      .orderBy(desc(jobContacts.id))
      .all();
  });

  handle(
    'contact:create',
    (
      _event,
      {
        jobId,
        ...fields
      }: Partial<typeof contacts.$inferInsert> & {
        jobId: number;
        firstName: string;
        lastName: string;
      },
    ) => {
      const db = getDb();

      return db.transaction((table) => {
        const contact = table.insert(contacts).values(fields).returning().get();

        table
          .insert(jobContacts)
          .values({ jobId, contactId: contact.id })
          .run();

        return contact;
      });
    },
  );

  handle(
    'contact:update',
    (
      _event,
      { id, ...fields }: Partial<typeof contacts.$inferInsert> & { id: number },
    ) => {
      const db = getDb();

      const cleanFields = Object.fromEntries(
        Object.entries(fields).filter(([, v]) => v !== undefined),
      );

      if (Object.keys(cleanFields).length === 0) {
        return db.select().from(contacts).where(eq(contacts.id, id)).get();
      }

      return db
        .update(contacts)
        .set(cleanFields)
        .where(eq(contacts.id, id))
        .returning()
        .get();
    },
  );

  handle('contact:delete', (_event, { id }: { id: number }) => {
    const db = getDb();
    db.delete(contacts).where(eq(contacts.id, id)).run();
  });
};
