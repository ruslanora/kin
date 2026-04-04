import { asc, desc, eq, getTableColumns, max, sql } from 'drizzle-orm';

import { getDb } from '../database/client';
import { columns, companies, jobContacts, jobs } from '../database/schema';
import { handle } from './handle';

export const registerJobHandlers = (): void => {
  handle(
    'job:create',
    (
      _event,
      {
        columnId,
        title,
        url,
        companyName,
        description,
      }: {
        columnId: number;
        title?: string;
        url?: string;
        companyName: string;
        description?: string;
      },
    ) => {
      const db = getDb();

      return db.transaction((table) => {
        const normalizedName = companyName.trim();

        const existing = table
          .select()
          .from(companies)
          .where(sql`lower(${companies.name}) = lower(${normalizedName})`)
          .limit(1)
          .get();

        const company =
          existing ??
          table
            .insert(companies)
            .values({ name: normalizedName })
            .returning()
            .get();

        const result = table
          .select({ maxOrder: max(jobs.order) })
          .from(jobs)
          .where(eq(jobs.columnId, columnId))
          .get();

        const nextOrder =
          result?.maxOrder !== null && result?.maxOrder !== undefined
            ? result.maxOrder + 1
            : 0;

        const job = table
          .insert(jobs)
          .values({
            columnId,
            companyId: company.id,
            order: nextOrder,
            title,
            url,
            description,
            createdAt: new Date(),
          })
          .returning()
          .get();

        return { ...job, companyName: company.name };
      });
    },
  );

  handle(
    'job:reorder',
    (
      _event,
      {
        sourceOrderedIds,
        targetColumnId,
        targetOrderedIds,
      }: {
        sourceColumnId: number;
        sourceOrderedIds: number[];
        targetColumnId: number;
        targetOrderedIds: number[];
      },
    ) => {
      const db = getDb();

      db.transaction((table) => {
        sourceOrderedIds.forEach((id, index) => {
          table.update(jobs).set({ order: index }).where(eq(jobs.id, id)).run();
        });
        targetOrderedIds.forEach((id, index) => {
          table
            .update(jobs)
            .set({ order: index, columnId: targetColumnId })
            .where(eq(jobs.id, id))
            .run();
        });
      });
    },
  );

  handle('job:getById', (_event, { id }: { id: number }) => {
    const db = getDb();

    return db
      .select({
        ...getTableColumns(jobs),
        companyName: companies.name,
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.id, id))
      .get();
  });

  handle(
    'job:update',
    (
      _event,
      { id, ...fields }: Partial<typeof jobs.$inferInsert> & { id: number },
    ) => {
      const db = getDb();

      const cleanFields = Object.fromEntries(
        Object.entries(fields).filter(([, v]) => v !== undefined),
      );

      if (Object.keys(cleanFields).length === 0) {
        return db
          .select(getTableColumns(jobs))
          .from(jobs)
          .where(eq(jobs.id, id))
          .get();
      }

      return db
        .update(jobs)
        .set(cleanFields)
        .where(eq(jobs.id, id))
        .returning()
        .get();
    },
  );

  handle('job:getByBoard', (_event, { boardId }: { boardId: number }) => {
    const db = getDb();

    return db
      .select({
        ...getTableColumns(jobs),
        companyName: companies.name,
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(columns, eq(jobs.columnId, columns.id))
      .where(eq(columns.boardId, boardId))
      .orderBy(asc(jobs.order))
      .all();
  });

  handle('job:getByCompany', (_event, { companyId }: { companyId: number }) => {
    const db = getDb();

    return db
      .select({
        ...getTableColumns(jobs),
        companyName: companies.name,
        columnName: columns.name,
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(columns, eq(jobs.columnId, columns.id))
      .where(eq(jobs.companyId, companyId))
      .orderBy(desc(jobs.createdAt))
      .all();
  });

  handle('job:delete', (_event, { id }: { id: number }) => {
    const db = getDb();
    db.delete(jobs).where(eq(jobs.id, id)).run();
  });

  handle('job:getByContact', (_event, { contactId }: { contactId: number }) => {
    const db = getDb();

    return db
      .select({
        ...getTableColumns(jobs),
        companyName: companies.name,
        columnName: columns.name,
      })
      .from(jobs)
      .innerJoin(jobContacts, eq(jobContacts.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .innerJoin(columns, eq(jobs.columnId, columns.id))
      .where(eq(jobContacts.contactId, contactId))
      .orderBy(desc(jobs.createdAt))
      .all();
  });
};
