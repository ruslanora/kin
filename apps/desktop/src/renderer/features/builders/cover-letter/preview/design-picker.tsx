import { Button, Range, Select } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { DESIGN_LIST } from '../../designs/index';
import { useResume } from '../../resume/context';
import { buildCoverLetterPdfHtml, buildCoverLetterTxt } from '../../utils';
import { useCoverLetter } from '../context';

type PropsType = {
  spacingMultiplier: number;
  design: string;
  onDesignChange: (design: string) => void;
  onSpacingChange: (spacing: number) => void;
};

export const CoverLetterDesignPicker: FunctionComponent<PropsType> = ({
  spacingMultiplier,
  design,
  onDesignChange,
  onSpacingChange,
}) => {
  const { resume } = useResume();
  const { coverLetter } = useCoverLetter();
  const [exportingTxt, setExportingTxt] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const filename =
    [resume?.firstName, resume?.lastName]
      .filter(Boolean)
      .join('_')
      .toLowerCase()
      .replace(/\s+/g, '_') || 'cover_letter';

  const handleExportTxt = async () => {
    if (!resume) return;

    setExportingTxt(true);

    try {
      await window.api.resume.exportTxt({
        text: buildCoverLetterTxt(resume, coverLetter?.content ?? ''),
        filename: `${filename}_cover_letter.txt`,
      });
    } finally {
      setExportingTxt(false);
    }
  };

  const handleGeneratePdf = async () => {
    setExportingPdf(true);

    try {
      await window.api.resume.generatePdf({
        html: buildCoverLetterPdfHtml(),
        filename: `${filename}_cover_letter.pdf`,
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
          selected={design}
          setSelected={(value) => value && onDesignChange(String(value))}
          options={DESIGN_LIST.map((design) => ({
            name: design.label,
            value: design.id,
          }))}
        />
      </div>
      <div className="flex-1">
        <Range
          label="Spacing"
          min={0}
          max={3}
          step={0.05}
          value={spacingMultiplier}
          onChange={onSpacingChange}
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
