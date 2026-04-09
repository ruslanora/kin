import { eq } from 'drizzle-orm';

import { getDb } from '../database/client';
import type { CoverLetterType } from '../database/schema';
import { coverLetters, resumes } from '../database/schema';
import { handle } from './handle';

export const registerCoverLetterHandlers = (): void => {
  handle('coverLetter:getMaster', (): CoverLetterType => {
    const db = getDb();

    const resume = db
      .select()
      .from(resumes)
      .where(eq(resumes.isMaster, true))
      .get();

    if (!resume) {
      throw new Error('Master resume not found');
    }

    let coverLetter = db
      .select()
      .from(coverLetters)
      .where(eq(coverLetters.resumeId, resume.id))
      .get();

    if (!coverLetter) {
      coverLetter = db
        .insert(coverLetters)
        .values({ resumeId: resume.id, content: '' })
        .returning()
        .get();
    }

    return coverLetter;
  });

  handle(
    'coverLetter:update',
    (
      _event,
      { id, content }: { id: number; content: string },
    ): CoverLetterType => {
      const db = getDb();
      return db
        .update(coverLetters)
        .set({ content })
        .where(eq(coverLetters.id, id))
        .returning()
        .get();
    },
  );
};
