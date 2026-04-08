# Master Resume Builder — Implementation Plan

## Context

The app needs a master resume builder where users can construct a structured resume and later create job-specific versions from it (forked copies). The builder must be modular enough to embed in the job page for versioned resumes. AI will eventually rewrite content per job description; on the free plan, users do this manually.

**Key decisions:**

- **Builder UX**: Structured form sections — required for clean AI targeting of specific fields/bullets
- **Preview**: iframe rendering HTML from React template components + isolated CSS (later phase)
- **PDF**: Electron `webContents.printToPDF()` via IPC (later phase)
- **Versioning**: Fork from master on job resume creation — master and job copies are independent records
- **Templates**: React components as resume styles (later phase)

---

## What's Done

- Schema: `resumes`, `resumeSections`, `resumeContents` tables + `settings` column + export types
- Migration generated and applied
- IPC handlers: `getMaster` (auto-creates with default sections), `update`, `upsertSection`, `deleteSection`, `reorderSections`, `upsertContent`, `deleteContent`, `reorderContents`
- Preload: `resume` namespace wired to all handlers
- `ResumeProvider` — accepts `initialResume` prop, manages all CRUD state with debounced saves
- `ResumeBuilder` — two-column shell (left: form, right: preview placeholder)
- `AboutSection` — blur-to-save personal info fields
- `ResumeSections` — HTML5 DnD section list + "Add Section" button
- `SectionItem` — editable name, visibility toggle, delete, HTML5 DnD record list
- `PeriodRecord`, `CategoryRecord`, `ListRecord` — all three record types
- `AddSectionModal` — type picker + name input
- `MasterResume` page — fetches/creates master resume, passes to provider

---

## Remaining

### IPC

- `resume:getById` — fetch any resume by id (needed for job-specific resume page)
- `resume:forkToJob` — deep copy resume→sections→contents, link to job via `jobs.resumeId`
- `resume:exportPdf` — hidden BrowserWindow → `printToPDF` → return buffer

### UI

- **Preview panel** — render resume HTML in an iframe using a React template component + isolated CSS
- **PDF export button** — trigger `resume:exportPdf`, save to disk
- **Template picker** — select from React resume style components (classic, modern, etc.)
- **Job resume page** — embed `ResumeBuilder` for a job-specific forked resume
- **Fork UI** — "Create Resume from Master" button on job page → calls `resume:forkToJob`
- **Settings panel** — line spacing / font size controls writing to `resumes.settings`
