import type { ResumeWithSectionsType } from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

import { DESIGN_MAP } from '../../designs/index';
import { CoverLetterHeader } from './cover-letter-header';

type PropsType = {
  resume: ResumeWithSectionsType;
  content: string;
  spacingMultiplier: number;
  design: string;
};

export const CoverLetterDocument: FunctionComponent<PropsType> = ({
  resume,
  content,
  spacingMultiplier,
  design: designId,
}) => {
  const design = DESIGN_MAP[designId ?? 'classic'] ?? DESIGN_MAP['classic'];

  return (
    <div
      className={`cover-letter-root design-${design.id}`}
      style={
        { '--spacing-multiplier': spacingMultiplier } as React.CSSProperties
      }
    >
      {design.css && <style>{design.css}</style>}
      <div
        className="cover-letter-page"
        style={{
          width: 816,
          minHeight: 1056,
          marginBottom: 16,
          boxSizing: 'border-box',
          padding: 72,
        }}
      >
        <CoverLetterHeader resume={resume} />
        <div
          className="cover-letter-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};
