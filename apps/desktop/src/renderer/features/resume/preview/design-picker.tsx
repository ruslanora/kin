import { Button, Range, Select } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { useResume } from '../context';
import { DESIGN_LIST } from './designs/index';

const stripHtml = (html: string): string =>
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

const buildTxt = (
  resume: NonNullable<ReturnType<typeof useResume>['resume']>,
): string => {
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
        if (parts.length) lines.push(parts.join(' | '));
        if (content.content) lines.push(stripHtml(content.content));
      } else if (section.contentType === 'category') {
        const line = [content.title, content.content]
          .filter(Boolean)
          .join(': ');
        if (line) lines.push(line);
      } else if (section.contentType === 'list') {
        if (content.content) lines.push(stripHtml(content.content));
      }
    }
  }

  return lines.join('\n');
};

const buildPdfHtml = (): string => {
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

export const DesignPicker: FunctionComponent = () => {
  const { resume, updateDesign, parsedSettings, updateSettings } = useResume();
  const [exportingTxt, setExportingTxt] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const activeDesign = resume?.design ?? 'classic';
  const spacing = parsedSettings.spacingMultiplier;

  const filename =
    [resume?.firstName, resume?.lastName]
      .filter(Boolean)
      .join('_')
      .toLowerCase()
      .replace(/\s+/g, '_') || 'resume';

  const handleExportTxt = async () => {
    if (!resume) return;
    setExportingTxt(true);
    try {
      await window.api.resume.exportTxt({
        text: buildTxt(resume),
        filename: `${filename}.txt`,
      });
    } finally {
      setExportingTxt(false);
    }
  };

  const handleGeneratePdf = async () => {
    setExportingPdf(true);
    try {
      await window.api.resume.generatePdf({
        html: buildPdfHtml(),
        filename: `${filename}.pdf`,
      });
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 shrink-0">
      <div className="w-36 shrink-0">
        <Select
          label="Design"
          selected={activeDesign}
          setSelected={(v) => v && updateDesign(String(v))}
          options={DESIGN_LIST.map((d) => ({ name: d.label, value: d.id }))}
        />
      </div>
      <div className="flex-1">
        <Range
          label="Spacing"
          min={0}
          max={3}
          step={0.05}
          value={spacing}
          onChange={(v) => updateSettings({ spacingMultiplier: v })}
        />
      </div>
      <Button
        type="button"
        style="secondary"
        onClick={handleExportTxt}
        disabled={exportingTxt}
      >
        {exportingTxt ? 'Exporting…' : 'Export TXT'}
      </Button>
      <Button
        type="button"
        style="primary"
        onClick={handleGeneratePdf}
        disabled={exportingPdf}
      >
        {exportingPdf ? 'Generating…' : 'Generate PDF'}
      </Button>
    </div>
  );
};
