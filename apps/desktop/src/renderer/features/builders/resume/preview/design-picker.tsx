import { Button, Range, Select } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { DESIGN_LIST } from '../../designs/index';
import { buildResumePdfHtml, buildResumeTxt } from '../../utils';
import { useResume } from '../context';

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
        text: buildResumeTxt(resume),
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
        html: buildResumePdfHtml(),
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
