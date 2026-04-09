import { and, desc, eq, gte, lt } from 'drizzle-orm';

import { getDb } from '../database/client';
import { companies, interviews, jobs } from '../database/schema';
import {
  buildEventTitle,
  buildFollowUpTitle,
  createCalendarEvent,
  deleteCalendarEvent,
  isCalendarAuthorized,
} from '../services/calendar';
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

      const interview = db
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

      if (isCalendarAuthorized()) {
        const jobInfo = db
          .select({ companyName: companies.name })
          .from(jobs)
          .innerJoin(companies, eq(jobs.companyId, companies.id))
          .where(eq(jobs.id, jobId))
          .get();

        if (jobInfo) {
          const scheduledDate = new Date(scheduledAt);
          const calendarEventId = createCalendarEvent({
            title: buildEventTitle(jobInfo.companyName, round),
            scheduledAt: scheduledDate,
            note,
          });

          let calendarFollowUpEventId: string | null = null;
          if (interview.followUp) {
            const followUpDate = new Date(scheduledDate);
            followUpDate.setDate(followUpDate.getDate() + 7);
            calendarFollowUpEventId = createCalendarEvent({
              title: buildFollowUpTitle(jobInfo.companyName, round),
              scheduledAt: followUpDate,
              note,
            });
          }

          return db
            .update(interviews)
            .set({ calendarEventId, calendarFollowUpEventId })
            .where(eq(interviews.id, interview.id))
            .returning()
            .get();
        }
      }

      return interview;
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

      const currentData = db
        .select({
          calendarEventId: interviews.calendarEventId,
          calendarFollowUpEventId: interviews.calendarFollowUpEventId,
          companyName: companies.name,
        })
        .from(interviews)
        .innerJoin(jobs, eq(interviews.jobId, jobs.id))
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(interviews.id, id))
        .get();

      const cleanFields = Object.fromEntries(
        Object.entries(fields).filter(([, value]) => value !== undefined),
      );

      if (scheduledAt !== undefined) {
        Object.assign(cleanFields, { scheduledAt: new Date(scheduledAt) });
      }

      if (Object.keys(cleanFields).length === 0) {
        return db.select().from(interviews).where(eq(interviews.id, id)).get();
      }

      const updated = db
        .update(interviews)
        .set(cleanFields)
        .where(eq(interviews.id, id))
        .returning()
        .get();

      if (isCalendarAuthorized() && currentData) {
        if (currentData.calendarEventId) {
          deleteCalendarEvent(currentData.calendarEventId);
        }
        if (currentData.calendarFollowUpEventId) {
          deleteCalendarEvent(currentData.calendarFollowUpEventId);
        }

        const scheduledDate = updated.scheduledAt;
        const calendarEventId = createCalendarEvent({
          title: buildEventTitle(currentData.companyName, updated.round),
          scheduledAt: scheduledDate,
          note: updated.note,
        });

        let calendarFollowUpEventId: string | null = null;
        if (updated.followUp) {
          const followUpDate = new Date(scheduledDate);
          followUpDate.setDate(followUpDate.getDate() + 7);
          calendarFollowUpEventId = createCalendarEvent({
            title: buildFollowUpTitle(currentData.companyName, updated.round),
            scheduledAt: followUpDate,
            note: updated.note,
          });
        }

        return db
          .update(interviews)
          .set({ calendarEventId, calendarFollowUpEventId })
          .where(eq(interviews.id, id))
          .returning()
          .get();
      }

      return updated;
    },
  );

  handle('interview:delete', (_event, { id }: { id: number }) => {
    const db = getDb();

    if (isCalendarAuthorized()) {
      const interview = db
        .select({
          calendarEventId: interviews.calendarEventId,
          calendarFollowUpEventId: interviews.calendarFollowUpEventId,
        })
        .from(interviews)
        .where(eq(interviews.id, id))
        .get();

      if (interview?.calendarEventId) {
        deleteCalendarEvent(interview.calendarEventId);
      }
      if (interview?.calendarFollowUpEventId) {
        deleteCalendarEvent(interview.calendarFollowUpEventId);
      }
    }

    db.delete(interviews).where(eq(interviews.id, id)).run();
  });
};
