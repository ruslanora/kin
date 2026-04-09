CREATE TABLE `cover_letters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resume_id` integer,
	`content` text,
	`pdf_path` text,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unq_resume_cover_letter` ON `cover_letters` (`resume_id`);--> statement-breakpoint
CREATE TABLE `resume_contents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_id` integer NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`title` text,
	`subtitle` text,
	`website` text,
	`start_month` integer,
	`start_year` integer,
	`end_month` integer,
	`end_year` integer,
	`is_current` integer DEFAULT false NOT NULL,
	`content` text,
	FOREIGN KEY (`section_id`) REFERENCES `resume_sections`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_resume_contents_section_id` ON `resume_contents` (`section_id`);--> statement-breakpoint
CREATE TABLE `resume_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resume_id` integer NOT NULL,
	`name` text,
	`order` integer DEFAULT 0 NOT NULL,
	`content_type` text DEFAULT 'period' NOT NULL,
	`preset` text,
	`is_visible` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_resume_sections_resume_id` ON `resume_sections` (`resume_id`);--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text,
	`last_name` text,
	`title` text,
	`summary` text,
	`linkedin` text,
	`website` text,
	`address` text,
	`phone` text,
	`email` text,
	`is_master` integer DEFAULT false NOT NULL,
	`design` text DEFAULT 'classic' NOT NULL,
	`pdf_path` text,
	`settings` text
);
--> statement-breakpoint
ALTER TABLE `jobs` ADD `resume_id` integer REFERENCES resumes(id);--> statement-breakpoint
ALTER TABLE `jobs` ADD `cover_letter_id` integer REFERENCES cover_letters(id);