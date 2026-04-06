# Contributing to Kin: Job Search Companion

Thank you for your interest in contributing to Kin: Job Search Companion!

**Kin: Job Search Companion** is a free, offline-first, and open-source desktop app designed to help people organize and manage their job search while keeping full control of their data.

We welcome contributions of all kinds—bug fixes, features, documentation improvements, and more.

## Project Overview

Kin is built as a TypeScript monorepo managed with pnpm workspaces.

### Architecture

- `apps/desktop/` - Electron desktop app (primary platform)
- `apps/extension/` - Chrome/Brave browser extension
- `libs/ui/` - Shared React component library (@kin/ui)

## Getting Started

### Prerequisites

- Node.js (>=23.11.1, <=25.9.0)
- pnpm (>=10.33.0)

### Installation

Clone the repository:

```sh
git clone git@github.com:ruslanora/kin.git
```

`cd` into the project folder and install all dependencies:

```sh
pnpm i
```

To start the app in dev mode, run:

```sh
pnpm app:start
```

To build the extension, run:

```sh
pnpm ext:build
```

You can add the extension by following [this guide](http://support.google.com/chrome_webstore/answer/2664769). You can find the build in `apps/extension/dist/`.

### Branching Strategy

We follow a simple two-branch model:

- `main` → production (released code)
- `develop` → active development

### How to contribute

1. Branch off `develop`
2. Use one of the following naming conventions:

- `feature/...` or `feat/...` for features
- `bugfix/...` or `fix/...` for bug fixes
- `chore/...` for anything else (docs, package updates, etc.)

Open a Pull Request into `develop` only.

When `develop` is stable, it will be merged into `main` for release.

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

Examples:

- `feat: add job tagging system`
- `fix: resolve crash on startup`
- `chore: update dependencies`

### Pull Requests

PRs must target `develop`.

Fill out the PR template as completely as possible, and ensure that all checks pass before requesting a review.

At least one member of the maintainer team must approve before merging.

### Code Standards

- Language: TypeScript
- Linting: ESLint. See [eslint.config.mjs](eslint.config.mjs)
- Formatting: Prettier. See [prettier.config.js](prettier.config.js)
- Testing: Jest

> Tests are not required, but highly encouraged!

### Continuous Integration (CI)

We use local Git hooks to help maintain code quality before changes are committed or pushed:

- `pre-commit` → runs lint and format checks
- `pre-push` → runs lint, format, and tests, and packaging of both the app and the extension

If a hook fails, please fix the issues before proceeding.

Remotely, we run every check on every Pull Request via GitHub Actions. This mirrors the local Git hooks to ensure consistency across environments.

The build process, however, targets macOS (Darwin) on ARM architecture. As a result, builds _may_ (or may not) fail in GitHub Actions when changes are developed on Windows or Linux environments.

### AI Usage

AI-assisted contributions are allowed.

However, code **must** remain clear, understandable, and maintainable.

Let's say, if a junior-to-mid engineer cannot reasonably understand or maintain the code without AI, it’s too complex. Please simplify.

Mass opening issues or pull requests that are entirely AI-generated will not be tolerated. Such pull requests will be closed without review, and the contributing user will be blocked from the repository.

### Issues & Bug Reports

We provide templates for issues and bug reports.

Please, fill out all relevant fields and provide clear reproduction steps when applicable.

Well-documented issues help us fix things faster.

### Versioning & Releases

We follow [Semantic Versioning](https://semver.org/).

## Final Notes

- Keep things simple
- Prefer clarity over cleverness
- Small, focused PRs are easier to review and merge

Thanks again for contributing to Kin! ❤️
