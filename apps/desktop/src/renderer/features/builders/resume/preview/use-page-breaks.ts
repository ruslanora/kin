import type {
  ResumeContentType,
  ResumeSectionType,
  ResumeWithSectionsType,
} from '@kin/desktop/main/database';
import { type RefObject, useLayoutEffect, useRef, useState } from 'react';

import type { PageContentType, SectionChunkType } from '../../types';

const CONTENT_HEIGHT = 1056 - 72 * 2;

export function usePageBreaks(
  sourceRef: RefObject<HTMLDivElement | null>,
  resume: ResumeWithSectionsType,
): PageContentType[] {
  const [pages, setPages] = useState<PageContentType[]>([
    { header: true, chunks: [] },
  ]);

  const prevKeyRef = useRef<string>('');

  useLayoutEffect(() => {
    const source = sourceRef.current;

    if (!source) return;

    const compute = () => {
      const headerEl = source.querySelector<HTMLElement>(
        '[data-resume-header]',
      );

      const headerHeight = headerEl?.offsetHeight ?? 0;

      const visibleSections = resume.sections.filter(
        (s) => s.isVisible !== false,
      );

      type PlacedItem =
        | { kind: 'header'; height: number }
        | {
            kind: 'content';
            section: ResumeSectionType & { contents: ResumeContentType[] };
            contentIndex: number;
            isFirstInSection: boolean;
            sectionHeadingHeight: number;
            height: number;
          };

      const flatItems: PlacedItem[] = [];

      if (headerHeight > 0) {
        flatItems.push({ kind: 'header', height: headerHeight });
      }

      for (const section of visibleSections) {
        const visibleContents = section.contents.filter(
          (c) => c.isVisible !== false,
        );

        if (visibleContents.length === 0) continue;

        const headingEl = source.querySelector<HTMLElement>(
          `[data-section-id="${section.id}"]`,
        );

        const sectionHeadingHeight = headingEl?.offsetHeight ?? 0;

        visibleContents.forEach((content, idx) => {
          const contentEl = source.querySelector<HTMLElement>(
            `[data-content-id="${content.id}"]`,
          );

          const height = contentEl?.offsetHeight ?? 0;

          flatItems.push({
            kind: 'content',
            section: section as ResumeSectionType & {
              contents: ResumeContentType[];
            },
            contentIndex: idx,
            isFirstInSection: idx === 0,
            sectionHeadingHeight: idx === 0 ? sectionHeadingHeight : 0,
            height,
          });
        });
      }

      const result: PageContentType[] = [];

      let currentPage: PageContentType = { chunks: [] };
      let cursor = 0;

      const flushPage = () => {
        result.push(currentPage);
        currentPage = { chunks: [] };
        cursor = 0;
      };

      const getOrAddChunk = (
        section: ResumeSectionType & { contents: ResumeContentType[] },
        showHeading: boolean,
        startIdx: number,
      ): SectionChunkType => {
        const last = currentPage.chunks[currentPage.chunks.length - 1];

        if (last?.section.id === section.id) {
          return last;
        }

        const chunk: SectionChunkType = {
          section,
          contentRange: [startIdx, startIdx],
          showSectionHeading: showHeading,
        };

        currentPage.chunks.push(chunk);

        return chunk;
      };

      for (const item of flatItems) {
        if (item.kind === 'header') {
          if (cursor + item.height > CONTENT_HEIGHT && cursor > 0) flushPage();

          currentPage.header = true;
          cursor += item.height;

          continue;
        }

        const headingH = item.isFirstInSection ? item.sectionHeadingHeight : 0;
        const needed = headingH + item.height;

        if (cursor + needed > CONTENT_HEIGHT && cursor > 0) {
          flushPage();
        }

        const chunk = getOrAddChunk(
          item.section,
          item.isFirstInSection,
          item.contentIndex,
        );

        chunk.contentRange[1] = item.contentIndex + 1;
        cursor += needed;
      }

      if (currentPage.header || currentPage.chunks.length > 0) {
        result.push(currentPage);
      }

      const key = JSON.stringify(
        result.map((p) => ({
          h: p.header,
          c: p.chunks.map((ch) => ({
            id: ch.section.id,
            r: ch.contentRange,
            sh: ch.showSectionHeading,
          })),
        })),
      );

      if (key !== prevKeyRef.current) {
        prevKeyRef.current = key;
        setPages(result.length > 0 ? result : [{ header: true, chunks: [] }]);
      }
    };

    compute();
    document.fonts.ready.then(compute);
  });

  return pages;
}
