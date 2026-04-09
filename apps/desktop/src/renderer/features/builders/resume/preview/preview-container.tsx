import type { FunctionComponent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useResume } from '../context';
import { DesignPicker } from './design-picker';
import { ResumeDocument } from './resume-document';

export const PreviewContainer: FunctionComponent = () => {
  const { resume, parsedSettings } = useResume();

  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? element.clientWidth;
      setScale((width / 816) * 0.7);
    });

    observer.observe(element);
    setScale((element.clientWidth / 816) * 0.7);

    return () => observer.disconnect();
  }, []);

  if (!resume) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <DesignPicker />
      <div
        ref={containerRef}
        className="flex-1 overflow-x-hidden overflow-y-auto relative bg-stone-100 dark:bg-stone-900"
      >
        <div
          className="w-206 mx-auto"
          style={{
            transformOrigin: 'top center',
            transform: `scale(${scale})`,
          }}
        >
          <ResumeDocument
            resume={resume}
            spacingMultiplier={parsedSettings.spacingMultiplier}
          />
        </div>
      </div>
    </div>
  );
};
