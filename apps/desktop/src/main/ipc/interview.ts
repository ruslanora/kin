import { and, desc, eq, gte, lt } from 'drizzle-orm';

import { getDb } from '../database/client';
import { companies, interviews, jobs } from '../database/schema';
import { handle } from './handle';

export const registerInterviewHandlers = (): void => {
  handle(
    'interview:getByMonth',
    (_event, { year, month }: { year: number; month: number }) => {
      const db = getDb();
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      // Fetch from 7 days before start to catch follow-ups whose original
      // interview was in the previous month but lands in this month.
      const extendedStart = new Date(start);
      extendedStart.setDate(extendedStart.getDate() - 7);

      const rows = db
        .select({
          id: interviews.id,
          jobId: interviews.jobId,
          round: interviews.round,
          note: interviews.note,
          scheduledAt: interviews.scheduledAt,
          followUp: interviews.followUp,
          jobTitle: jobs.title,
          companyName: companies.name,
        })
        .from(interviews)
        .innerJoin(jobs, eq(interviews.jobId, jobs.id))
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(
          and(
            gte(interviews.scheduledAt, extendedStart),
            lt(interviews.scheduledAt, end),
          ),
        )
        .all();

      const result = [];
      for (const row of rows) {
        if (row.scheduledAt >= start) {
          result.push({ ...row, isFollowUp: false });
        }
        if (row.followUp) {
          const followUpDate = new Date(row.scheduledAt);
          followUpDate.setDate(followUpDate.getDate() + 7);
          if (followUpDate >= start && followUpDate < end) {
            result.push({
              ...row,
              scheduledAt: followUpDate,
              isFollowUp: true,
            });
          }
        }
      }
      return result;
    },
  );

  handle('interview:getAll', (_event) => {
    const db = getDb();

    const rows = db
      .select({
        id: interviews.id,
        jobId: interviews.jobId,
        round: interviews.round,
        note: interviews.note,
        scheduledAt: interviews.scheduledAt,
        followUp: interviews.followUp,
        jobTitle: jobs.title,
        companyName: companies.name,
      })
      .from(interviews)
      .innerJoin(jobs, eq(interviews.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .orderBy(desc(interviews.scheduledAt))
      .all();

    const result = [];
    for (const row of rows) {
      result.push({ ...row, isFollowUp: false });
      if (row.followUp) {
        const followUpDate = new Date(row.scheduledAt);
        followUpDate.setDate(followUpDate.getDate() + 7);
        result.push({ ...row, scheduledAt: followUpDate, isFollowUp: true });
      }
    }
    return result;
  });

  handle('interview:getByJob', (_event, { jobId }: { jobId: number }) => {
    const db = getDb();

    return db
      .select()
      .from(interviews)
      .where(eq(interviews.jobId, jobId))
      .orderBy(desc(interviews.scheduledAt))
      .all();
  });

  handle(
    'interview:create',
    (
      _event,
      {
        jobId,
        scheduledAt,
        round,
        note,
        followUp,
      }: {
        jobId: number;
        scheduledAt: number;
        round?: string | null;
        note?: string | null;
        followUp?: boolean;
      },
    ) => {
      const db = getDb();

      return db
        .insert(interviews)
        .values({
          jobId,
          scheduledAt: new Date(scheduledAt),
          round,
          note,
          followUp: followUp ?? false,
        })
        .returning()
        .get();
    },
  );

  handle(
    'interview:update',
    (
      _event,
      {
        id,
        scheduledAt,
        ...fields
      }: {
        id: number;
        scheduledAt?: number;
        round?: string | null;
        note?: string | null;
        followUp?: boolean;
      },
    ) => {
      const db = getDb();

      const cleanFields = Object.fromEntries(
        Object.entries(fields).filter(([, v]) => v !== undefined),
      );

      if (scheduledAt !== undefined) {
        Object.assign(cleanFields, { scheduledAt: new Date(scheduledAt) });
      }

      if (Object.keys(cleanFields).length === 0) {
        return db.select().from(interviews).where(eq(interviews.id, id)).get();
      }

      return db
        .update(interviews)
        .set(cleanFields)
        .where(eq(interviews.id, id))
        .returning()
        .get();
    },
  );

  handle('interview:delete', (_event, { id }: { id: number }) => {
    const db = getDb();
    db.delete(interviews).where(eq(interviews.id, id)).run();
  });
};
