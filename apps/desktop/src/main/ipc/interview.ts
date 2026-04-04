import { and, eq, gte, lt } from 'drizzle-orm';
import { ipcMain } from 'electron';

import { getDb } from '../database/client';
import { companies, interviews, jobs } from '../database/schema';

export const registerInterviewHandlers = (): void => {
  ipcMain.handle('interview:getByMonth', (_, year: number, month: number) => {
    const db = getDb();
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    return db
      .select({
        id: interviews.id,
        jobId: interviews.jobId,
        round: interviews.round,
        note: interviews.note,
        scheduledAt: interviews.scheduledAt,
        isFollowUp: interviews.followUp,
        jobTitle: jobs.title,
        companyName: companies.name,
      })
      .from(interviews)
      .innerJoin(jobs, eq(interviews.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(
        and(
          gte(interviews.scheduledAt, start),
          lt(interviews.scheduledAt, end),
        ),
      )
      .all();
  });
};
