import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

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
  },
  (table) => [index('idx_interviews_job_id').on(table.jobId)],
);

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
};
