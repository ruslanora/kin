import type { ResumeWithSectionsType } from '@kin/desktop/main/database';
import { type FunctionComponent, useRef } from 'react';

import { DESIGN_MAP } from '../../designs/index';
import { PageLayout } from './page-layout';
import { SourceResume } from './source-resume';
import { usePageBreaks } from './use-page-breaks';

type PropsType = {
  resume: ResumeWithSectionsType;
  spacingMultiplier: number;
};

export const ResumeDocument: FunctionComponent<PropsType> = ({
  resume,
  spacingMultiplier,
}) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const pages = usePageBreaks(sourceRef, resume);

  const design =
    DESIGN_MAP[resume.design ?? 'classic'] ?? DESIGN_MAP['classic'];

  return (
    <div
      className={`resume-root design-${design.id}`}
      style={
        { '--spacing-multiplier': spacingMultiplier } as React.CSSProperties
      }
    >
      {design.css && <style>{design.css}</style>}
      <div
        ref={sourceRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: 816,
          top: 0,
          left: 0,
          padding: 72,
          boxSizing: 'border-box',
        }}
      >
        <SourceResume resume={resume} />
      </div>
      {pages.map((page, i) => (
        <PageLayout key={i} page={page} resume={resume} />
      ))}
    </div>
  );
};
