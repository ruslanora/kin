import { asc, eq, inArray } from 'drizzle-orm';
import { BrowserWindow, dialog, shell } from 'electron';
import { writeFileSync } from 'fs';

import { getDb } from '../database/client';
import type {
  ResumeContentType,
  ResumeSectionType,
  ResumeType,
  ResumeWithSectionsType,
} from '../database/schema';
import { resumeContents, resumes, resumeSections } from '../database/schema';
import { handle } from './handle';

const getResumeWithSections = (
  db: ReturnType<typeof getDb>,
  resumeId: number,
): ResumeWithSectionsType => {
  const resume = db
    .select()
    .from(resumes)
    .where(eq(resumes.id, resumeId))
    .get();

  if (!resume) {
    throw new Error(`Resume ${resumeId} not found`);
  }

  const sections = db
    .select()
    .from(resumeSections)
    .where(eq(resumeSections.resumeId, resume.id))
    .orderBy(asc(resumeSections.order))
    .all();

  const allContents =
    sections.length > 0
      ? db
          .select()
          .from(resumeContents)
          .where(
            inArray(
              resumeContents.sectionId,
              sections.map((s) => s.id),
            ),
          )
          .orderBy(asc(resumeContents.order))
          .all()
      : [];

  return {
    ...resume,
    sections: sections.map((section) => ({
      ...section,
      contents: allContents.filter((c) => c.sectionId === section.id),
    })),
  };
};

export const registerResumeHandlers = (): void => {
  handle('resume:getMaster', (): ResumeWithSectionsType => {
    const db = getDb();

    let resume = db
      .select()
      .from(resumes)
      .where(eq(resumes.isMaster, true))
      .get();

    if (!resume) {
      resume = db
        .insert(resumes)
        .values({ isMaster: true, design: 'classic' })
        .returning()
        .get();

      db.insert(resumeSections)
        .values([
          {
            resumeId: resume.id,
            name: 'Experience',
            order: 0,
            contentType: 'period',
            preset: 'experience',
          },
          {
            resumeId: resume.id,
            name: 'Education',
            order: 1,
            contentType: 'period',
            preset: 'education',
          },
        ])
        .run();
    }

    return getResumeWithSections(db, resume.id);
  });

  handle(
    'resume:getById',
    (_event, { id }: { id: number }): ResumeWithSectionsType => {
      const db = getDb();
      return getResumeWithSections(db, id);
    },
  );

  handle('resume:fork', (): ResumeWithSectionsType => {
    const db = getDb();

    const master = db
      .select()
      .from(resumes)
      .where(eq(resumes.isMaster, true))
      .get();

    if (!master) {
      throw new Error('Master resume not found');
    }

    const forked = db
      .insert(resumes)
      .values({
        firstName: master.firstName,
        lastName: master.lastName,
        title: master.title,
        summary: master.summary,
        linkedin: master.linkedin,
        website: master.website,
        address: master.address,
        phone: master.phone,
        email: master.email,
        isMaster: false,
        design: master.design,
        settings: master.settings,
      })
      .returning()
      .get();

    const masterSections = db
      .select()
      .from(resumeSections)
      .where(eq(resumeSections.resumeId, master.id))
      .orderBy(asc(resumeSections.order))
      .all();

    const masterContents =
      masterSections.length > 0
        ? db
            .select()
            .from(resumeContents)
            .where(
              inArray(
                resumeContents.sectionId,
                masterSections.map((s) => s.id),
              ),
            )
            .orderBy(asc(resumeContents.order))
            .all()
        : [];

    for (const section of masterSections) {
      const newSection = db
        .insert(resumeSections)
        .values({
          resumeId: forked.id,
          name: section.name,
          order: section.order,
          contentType: section.contentType,
          preset: section.preset,
          isVisible: section.isVisible,
        })
        .returning()
        .get();

      const sectionContents = masterContents.filter(
        (c) => c.sectionId === section.id,
      );

      for (const content of sectionContents) {
        db.insert(resumeContents)
          .values({
            sectionId: newSection.id,
            order: content.order,
            isVisible: content.isVisible,
            title: content.title,
            subtitle: content.subtitle,
            location: content.location,
            website: content.website,
            startMonth: content.startMonth,
            startYear: content.startYear,
            endMonth: content.endMonth,
            endYear: content.endYear,
            isCurrent: content.isCurrent,
            content: content.content,
          })
          .run();
      }
    }

    return getResumeWithSections(db, forked.id);
  });

  handle('resume:deleteById', (_event, { id }: { id: number }): void => {
    const db = getDb();
    db.delete(resumes).where(eq(resumes.id, id)).run();
  });

  handle(
    'resume:update',
    (_event, args: { id: number } & Partial<ResumeType>): ResumeType => {
      const db = getDb();
      const { id, ...rest } = args;

      const fields: Partial<ResumeType> = {};
      for (const [key, value] of Object.entries(rest)) {
        if (value !== undefined) {
          (fields as Record<string, unknown>)[key] = value;
        }
      }

      return db
        .update(resumes)
        .set(fields)
        .where(eq(resumes.id, id))
        .returning()
        .get();
    },
  );

  handle(
    'resume:upsertSection',
    (
      _event,
      args: Partial<ResumeSectionType> & {
        resumeId: number;
        contentType: 'period' | 'category' | 'list';
      },
    ): ResumeSectionType => {
      const db = getDb();
      const { id, ...fields } = args;

      if (id !== undefined) {
        return db
          .insert(resumeSections)
          .values({ id, ...fields })
          .onConflictDoUpdate({
            target: resumeSections.id,
            set: fields,
          })
          .returning()
          .get();
      }

      return db.insert(resumeSections).values(fields).returning().get();
    },
  );

  handle('resume:deleteSection', (_event, { id }: { id: number }): void => {
    const db = getDb();
    db.delete(resumeSections).where(eq(resumeSections.id, id)).run();
  });

  handle(
    'resume:reorderSections',
    (_event, { orderedIds }: { orderedIds: number[] }): void => {
      const db = getDb();

      db.transaction((table) => {
        orderedIds.forEach((id, index) => {
          table
            .update(resumeSections)
            .set({ order: index })
            .where(eq(resumeSections.id, id))
            .run();
        });
      });
    },
  );

  handle(
    'resume:upsertContent',
    (
      _event,
      args: Partial<ResumeContentType> & { sectionId: number },
    ): ResumeContentType => {
      const db = getDb();
      const { id, ...fields } = args;

      if (id !== undefined) {
        return db
          .insert(resumeContents)
          .values({ id, ...fields })
          .onConflictDoUpdate({
            target: resumeContents.id,
            set: fields,
          })
          .returning()
          .get();
      }

      return db.insert(resumeContents).values(fields).returning().get();
    },
  );

  handle('resume:deleteContent', (_event, { id }: { id: number }): void => {
    const db = getDb();
    db.delete(resumeContents).where(eq(resumeContents.id, id)).run();
  });

  handle(
    'resume:exportTxt',
    async (_event, { text, filename }: { text: string; filename: string }) => {
      const { filePath } = await dialog.showSaveDialog({
        defaultPath: filename,
        filters: [{ name: 'Text', extensions: ['txt'] }],
      });
      if (filePath) {
        writeFileSync(filePath, text, 'utf-8');
        shell.openPath(filePath);
      }
    },
  );

  handle(
    'resume:generatePdf',
    async (_event, { html, filename }: { html: string; filename: string }) => {
      const win = new BrowserWindow({ show: false, width: 816 });
      await win.loadURL(
        `data:text/html;base64,${Buffer.from(html).toString('base64')}`,
      );
      const pdf = await win.webContents.printToPDF({
        pageSize: 'Letter',
        printBackground: true,
        margins: { marginType: 'none' },
      });
      win.close();

      const { filePath } = await dialog.showSaveDialog({
        defaultPath: filename,
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      });
      if (filePath) {
        writeFileSync(filePath, pdf);
        shell.openPath(filePath);
      }
    },
  );

  handle(
    'resume:reorderContents',
    (_event, { orderedIds }: { orderedIds: number[] }): void => {
      const db = getDb();

      db.transaction((table) => {
        orderedIds.forEach((id, index) => {
          table
            .update(resumeContents)
            .set({ order: index })
            .where(eq(resumeContents.id, id))
            .run();
        });
      });
    },
  );
};
