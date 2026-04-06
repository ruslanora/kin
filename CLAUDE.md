# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm app:start        # Start Electron app in development
pnpm ext:dev          # Watch and rebuild Chrome extension

# Build
pnpm app:make         # Build platform-specific installers
pnpm ext:build        # Build Chrome extension
pnpm ui:build         # Build shared UI component library

# Database
pnpm app:generate     # Generate Drizzle migrations
pnpm app:migrate      # Run migrations
pnpm app:studio       # Open Drizzle Studio

# Quality
pnpm lint             # ESLint with auto-fix
pnpm lint:check       # ESLint without changes
pnpm format           # Prettier format
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript type check (desktop + ui)
pnpm test             # Run Jest tests
pnpm test:watch       # Jest in watch mode
pnpm ui:test          # UI library tests only
```

## Architecture

Monorepo with pnpm workspaces:

```
apps/desktop/    # Electron desktop app (primary platform)
apps/extension/  # Chrome/Brave browser extension
libs/ui/         # Shared React component library (@kin/ui)
```

### Desktop App (`apps/desktop`)

Electron app with a clear main/renderer split:

- `src/main/` — Electron main process: IPC handlers, database, native APIs
- `src/renderer/` — React app served in the renderer process
- `src/main/database/schema.ts` — Drizzle/SQLite schema (boards, columns, companies, jobs, files, contacts, jobContacts, interviews)
- `src/main/ipc/` — IPC handler registration; renderer communicates with main exclusively via IPC

The app is a kanban-style job tracker. Core entities: boards → columns → jobs, with companies, contacts, interviews, and file attachments linked to jobs.

### Extension (`apps/extension`)

Chrome/Brave extension with a popup UI built in React + Vite. Uses Tiptap for rich text editing.

### UI Library (`libs/ui`)

Shared component library consumed by both desktop and extension. Components are built with Tailwind CSS v4 and Tiptap. Export path: `libs/ui/src/index.tsx`.

## Tech Stack

- **Electron** v41 + **React** v19 + **React Router DOM** v7
- **SQLite** via better-sqlite3 + **Drizzle ORM** for type-safe DB access
- **Vite** v8 for bundling (all apps)
- **Tailwind CSS** v4
- **TypeScript** v6 (strict)
- **Framer Motion** for animations
- **Tiptap** v3 for rich text

## Code Style

- Prettier: 80 char line width, single quotes, trailing commas
- ESLint flat config (`eslint.config.mjs`) with React, hooks, jsx-a11y, simple-import-sort
- Path alias `@/` resolves to `src/` in each app
