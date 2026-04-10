import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const resumes = sqliteTable('resumes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name'),
  lastName: text('last_name'),
  title: text('title'),
  summary: text('summary'),
  linkedin: text('linkedin'),
  website: text('website'),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  isMaster: integer('is_master', { mode: 'boolean' }).notNull().default(false),
  design: text('design').notNull().default('classic'),
  pdfPath: text('pdf_path'),
  settings: text('settings'),
});

export const resumeSections = sqliteTable(
  'resume_sections',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    resumeId: integer('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    name: text('name'),
    order: integer('order').notNull().default(0),
    contentType: text('content_type', { enum: ['period', 'category', 'list'] })
      .notNull()
      .default('period'),
    preset: text('preset'),
    isVisible: integer('is_visible', { mode: 'boolean' })
      .notNull()
      .default(true),
  },
  (table) => [index('idx_resume_sections_resume_id').on(table.resumeId)],
);

export const resumeContents = sqliteTable(
  'resume_contents',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sectionId: integer('section_id')
      .notNull()
      .references(() => resumeSections.id, { onDelete: 'cascade' }),
    order: integer('order').notNull().default(0),
    isVisible: integer('is_visible', { mode: 'boolean' })
      .notNull()
      .default(true),
    title: text('title'),
    subtitle: text('subtitle'),
    location: text('location'),
    website: text('website'),
    startMonth: integer('start_month'),
    startYear: integer('start_year'),
    endMonth: integer('end_month'),
    endYear: integer('end_year'),
    isCurrent: integer('is_current', { mode: 'boolean' })
      .notNull()
      .default(false),
    content: text('content'),
  },
  (table) => [index('idx_resume_contents_section_id').on(table.sectionId)],
);

export const coverLetters = sqliteTable(
  'cover_letters',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    resumeId: integer('resume_id').references(() => resumes.id, {
      onDelete: 'cascade',
    }),
    content: text('content'),
    pdfPath: text('pdf_path'),
  },
  (table) => [uniqueIndex('unq_resume_cover_letter').on(table.resumeId)],
);

export const boards = sqliteTable('boards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').default('New Job Hunt'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  archivedAt: integer('archived_at', { mode: 'timestamp' }),
});

export const columns = sqliteTable(
  'columns',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    boardId: integer('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    order: integer('order').notNull().default(0),
  },
  (table) => [index('idx_columns_board_id').on(table.boardId)],
);

export const companies = sqliteTable(
  'companies',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    industry: text('industry'),
    linkedin: text('linkedin'),
    website: text('website'),
    address: text('address'),
    note: text('note'),
    isToAvoid: integer('is_to_avoid', { mode: 'boolean' })
      .notNull()
      .default(false),
  },
  (table) => [uniqueIndex('unq_company_name').on(table.name)],
);

export const jobs = sqliteTable(
  'jobs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    columnId: integer('column_id')
      .notNull()
      .references(() => columns.id, { onDelete: 'cascade' }),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    order: integer('order').notNull().default(0),
    title: text('title'),
    url: text('url'),
    description: text('description'),
    note: text('note'),
    excitement: integer('excitement').notNull().default(0),
    workModel: text('work_model'),
    employmentType: text('employment_type'),
    salaryRangeFrom: real('salary_range_from'),
    salaryRangeTo: real('salary_range_to'),
    postedAt: integer('posted_at', { mode: 'timestamp' }),
    appliedAt: integer('applied_at', { mode: 'timestamp' }),
    followedUpAt: integer('followed_up_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    resumeId: integer('resume_id').references(() => resumes.id, {
      onDelete: 'set null',
    }),
    coverLetterId: integer('cover_letter_id').references(
      () => coverLetters.id,
      { onDelete: 'set null' },
    ),
  },
  (table) => [
    index('idx_jobs_column_id').on(table.columnId),
    index('idx_jobs_company_id').on(table.companyId),
  ],
);

export const files = sqliteTable(
  'files',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    jobId: integer('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    fileType: text('file_type', { enum: ['resume', 'cover_letter'] }).notNull(),
    fileName: text('file_name').notNull(),
    filePath: text('file_path').notNull(),
  },
  (table) => [index('idx_files_job_id').on(table.jobId)],
);

export const contacts = sqliteTable(
  'contacts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    companyId: integer('company_id').references(() => companies.id, {
      onDelete: 'set null',
    }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    title: text('title'),
    phone: text('phone'),
    email: text('email'),
    linkedin: text('linkedin'),
    website: text('website'),
    note: text('note'),
  },
  (table) => [index('idx_contacts_company_id').on(table.companyId)],
);

export const jobContacts = sqliteTable(
  'job_contacts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    jobId: integer('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    contactId: integer('contact_id')
      .notNull()
      .references(() => contacts.id, { onDelete: 'cascade' }),
  },
  (table) => [uniqueIndex('unq_job_contact').on(table.jobId, table.contactId)],
);

export const interviews = sqliteTable(
  'interviews',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    jobId: integer('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    round: text('round'),
    note: text('note'),
    scheduledAt: integer('scheduled_at', { mode: 'timestamp' }).notNull(),
    followUp: integer('follow_up', { mode: 'boolean' })
      .notNull()
      .default(false),
    calendarEventId: text('calendar_event_id'),
    calendarFollowUpEventId: text('calendar_follow_up_event_id'),
  },
  (table) => [index('idx_interviews_job_id').on(table.jobId)],
);

export type ResumeType = typeof resumes.$inferSelect;
export type ResumeSectionType = typeof resumeSections.$inferSelect;
export type ResumeContentType = typeof resumeContents.$inferSelect;
export type ResumeWithSectionsType = ResumeType & {
  sections: Array<ResumeSectionType & { contents: ResumeContentType[] }>;
};

export type CoverLetterType = typeof coverLetters.$inferSelect;

export type BoardType = typeof boards.$inferSelect;
export type ColumnType = typeof columns.$inferSelect;
export type CompanyType = typeof companies.$inferSelect;
export type JobType = typeof jobs.$inferSelect;
export type JobWithCompanyType = JobType & { companyName: string };
export type FileType = typeof files.$inferSelect;
export type ContactType = typeof contacts.$inferSelect;
export type ContactWithCompanyType = ContactType & {
  companyName: string | null;
};
export type JobContactType = typeof jobContacts.$inferSelect;
export type InterviewType = typeof interviews.$inferSelect;

export type InterviewWithJobType = InterviewType & {
  jobTitle: string | null;
  companyName: string;
  isFollowUp: boolean;
};
