import type { ResumeWithSectionsType } from '@kin/desktop/main/database';

export const toMonthString = (
  month: number | null | undefined,
  year: number | null | undefined,
) => (year && month ? `${year}-${String(month).padStart(2, '0')}` : '');

export const formatDate = (
  month: number | null | undefined,
  year: number | null | undefined,
): string => {
  if (!year) return '';

  if (!month) return String(year);

  const date = new Date(year, month - 1);

  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const stripHtml = (html: string): string =>
  html
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const buildResumeTxt = (resume: ResumeWithSectionsType): string => {
  const lines: string[] = [];

  const name = [resume.firstName, resume.lastName].filter(Boolean).join(' ');
  if (name) lines.push(name);

  if (resume.title) lines.push(resume.title);

  const contact = [
    resume.email,
    resume.phone,
    resume.linkedin,
    resume.website,
    resume.address,
  ].filter(Boolean);

  if (contact.length) lines.push(contact.join(' | '));

  if (resume.summary) {
    lines.push('');
    lines.push(resume.summary);
  }

  for (const section of resume.sections.filter((s) => s.isVisible !== false)) {
    const visibleContents = section.contents.filter(
      (c) => c.isVisible !== false,
    );

    if (visibleContents.length === 0) continue;

    lines.push('');
    lines.push((section.name ?? '').toUpperCase());
    lines.push('-'.repeat((section.name ?? '').length || 8));

    for (const content of visibleContents) {
      if (section.contentType === 'period') {
        const parts = [
          content.title,
          content.subtitle,
          content.location,
        ].filter(Boolean);

        if (parts.length) {
          lines.push(parts.join(' | '));
        }

        if (content.content) {
          lines.push(stripHtml(content.content));
        }
      } else if (section.contentType === 'category') {
        const line = [content.title, content.content]
          .filter(Boolean)
          .join(': ');

        if (line) {
          lines.push(line);
        }
      } else if (section.contentType === 'list') {
        if (content.content) {
          lines.push(stripHtml(content.content));
        }
      }
    }
  }

  return lines.join('\n');
};

export const buildResumePdfHtml = (): string => {
  const root = document.querySelector('.resume-root');

  if (!root) return '';

  const clone = root.cloneNode(true) as Element;
  clone.querySelector('[aria-hidden="true"]')?.remove();

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 816px; }
  .resume-page { page-break-after: always; }
  .resume-page:last-child { page-break-after: avoid; }
</style>
</head>
<body>${clone.outerHTML}</body>
</html>`;
};

export const buildCoverLetterTxt = (
  resume: ResumeWithSectionsType,
  content: string,
): string => {
  const lines: string[] = [];

  const name = [resume.firstName, resume.lastName].filter(Boolean).join(' ');
  if (name) lines.push(name);

  const contact = [
    resume.email,
    resume.phone,
    resume.linkedin,
    resume.website,
    resume.address,
  ].filter(Boolean);
  if (contact.length) lines.push(contact.join(' | '));

  if (content) {
    lines.push('');
    lines.push(stripHtml(content));
  }

  return lines.join('\n');
};

export const buildCoverLetterPdfHtml = (): string => {
  const root = document.querySelector('.cover-letter-root');

  if (!root) return '';

  const clone = root.cloneNode(true) as Element;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 816px; }
  .cover-letter-page { page-break-after: always; }
  .cover-letter-page:last-child { page-break-after: avoid; }
</style>
</head>
<body>${clone.outerHTML}</body>
</html>`;
};
