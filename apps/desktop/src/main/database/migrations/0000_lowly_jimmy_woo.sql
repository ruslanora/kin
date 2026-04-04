CREATE TABLE `boards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT 'New Job Hunt',
	`created_at` integer NOT NULL,
	`archived_at` integer
);
--> statement-breakpoint
CREATE TABLE `columns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`board_id` integer NOT NULL,
	`name` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_columns_board_id` ON `columns` (`board_id`);--> statement-breakpoint
CREATE TABLE `companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`industry` text,
	`linkedin` text,
	`website` text,
	`address` text,
	`note` text,
	`is_to_avoid` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unq_company_name` ON `companies` (`name`);--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_id` integer,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`title` text,
	`phone` text,
	`email` text,
	`linkedin` text,
	`website` text,
	`note` text,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_contacts_company_id` ON `contacts` (`company_id`);--> statement-breakpoint
CREATE TABLE `files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`file_type` text NOT NULL,
	`file_name` text NOT NULL,
	`file_path` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_files_job_id` ON `files` (`job_id`);--> statement-breakpoint
CREATE TABLE `interviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`round` text,
	`note` text,
	`scheduled_at` integer NOT NULL,
	`follow_up` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_interviews_job_id` ON `interviews` (`job_id`);--> statement-breakpoint
CREATE TABLE `job_contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`contact_id` integer NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unq_job_contact` ON `job_contacts` (`job_id`,`contact_id`);--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`column_id` integer NOT NULL,
	`company_id` integer NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`title` text,
	`url` text,
	`description` text,
	`note` text,
	`excitement` integer DEFAULT 0 NOT NULL,
	`work_model` text,
	`employment_type` text,
	`salary_range_from` real,
	`salary_range_to` real,
	`posted_at` integer,
	`applied_at` integer,
	`followed_up_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`column_id`) REFERENCES `columns`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_jobs_column_id` ON `jobs` (`column_id`);--> statement-breakpoint
CREATE INDEX `idx_jobs_company_id` ON `jobs` (`company_id`);