import type {
  ResumeContentType,
  ResumeSectionType,
  ResumeType,
  ResumeWithSectionsType,
} from '@kin/desktop/main/database';
import {
  createContext,
  type FunctionComponent,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

type ContextType = {
  resume: ResumeWithSectionsType | null;
  isLoading: boolean;
  updateBasicInfo: (fields: Partial<ResumeType>) => void;
  addSection: (
    contentType: 'period' | 'category' | 'list',
    name: string,
    preset?: string,
  ) => Promise<void>;
  updateSection: (id: number, fields: Partial<ResumeSectionType>) => void;
  deleteSection: (id: number) => Promise<void>;
  reorderSections: (orderedIds: number[]) => void;
  addContent: (
    sectionId: number,
    contentType: 'period' | 'category' | 'list',
  ) => Promise<void>;
  updateContent: (id: number, fields: Partial<ResumeContentType>) => void;
  deleteContent: (id: number) => Promise<void>;
  reorderContents: (sectionId: number, orderedIds: number[]) => void;
};

export const ResumeContext = createContext<ContextType | null>(null);

export const useResume = (): ContextType => {
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error('useResume must be called within ResumeContext provider!');
  }

  return context;
};

type ProviderProps = {
  initialResume: ResumeWithSectionsType;
  children: ReactNode;
};

export const ResumeProvider: FunctionComponent<ProviderProps> = ({
  initialResume,
  children,
}) => {
  const [resume, setResume] = useState<ResumeWithSectionsType | null>(
    initialResume,
  );
  const [isLoading] = useState(false);

  const resumeRef = useRef<ResumeWithSectionsType | null>(initialResume);
  const basicInfoDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const contentDebounceRefs = useRef<
    Map<number, ReturnType<typeof setTimeout>>
  >(new Map());

  const updateBasicInfo = useCallback(
    (fields: Partial<ResumeType>) => {
      if (!resume) return;

      setResume((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...fields };
        resumeRef.current = updated;
        return updated;
      });

      if (basicInfoDebounceRef.current) {
        clearTimeout(basicInfoDebounceRef.current);
      }

      basicInfoDebounceRef.current = setTimeout(async () => {
        await window.api.resume.update({ id: resume.id, ...fields });
      }, 600);
    },
    [resume],
  );

  const addSection = useCallback(
    async (
      contentType: 'period' | 'category' | 'list',
      name: string,
      preset?: string,
    ) => {
      if (!resume) return;

      const newSection = await window.api.resume.upsertSection({
        resumeId: resume.id,
        name,
        order: 0,
        contentType,
        preset,
      });

      const initialContents: ResumeContentType[] = [];

      if (contentType === 'list') {
        const newContent = await window.api.resume.upsertContent({
          sectionId: newSection.id,
          order: 0,
        });
        initialContents.push(newContent);
      }

      setResume((prev) =>
        prev
          ? {
              ...prev,
              sections: [
                { ...newSection, contents: initialContents },
                ...prev.sections,
              ],
            }
          : prev,
      );
    },
    [resume],
  );

  const updateSection = useCallback(
    (id: number, fields: Partial<ResumeSectionType>) => {
      if (!resume) return;

      setResume((prev) =>
        prev
          ? {
              ...prev,
              sections: prev.sections.map((s) =>
                s.id === id ? { ...s, ...fields } : s,
              ),
            }
          : prev,
      );

      const section = resume.sections.find((s) => s.id === id);
      if (!section) return;

      window.api.resume.upsertSection({
        id,
        resumeId: section.resumeId,
        contentType: section.contentType,
        ...fields,
      });
    },
    [resume],
  );

  const deleteSection = useCallback(async (id: number) => {
    setResume((prev) =>
      prev
        ? {
            ...prev,
            sections: prev.sections.filter((s) => s.id !== id),
          }
        : prev,
    );

    await window.api.resume.deleteSection({ id });
  }, []);

  const reorderSections = useCallback((orderedIds: number[]) => {
    setResume((prev) => {
      if (!prev) return prev;

      const sectionMap = new Map(prev.sections.map((s) => [s.id, s]));
      const reordered = orderedIds
        .map((id) => sectionMap.get(id))
        .filter(Boolean) as Array<
        ResumeSectionType & { contents: ResumeContentType[] }
      >;

      return { ...prev, sections: reordered };
    });

    window.api.resume.reorderSections({ orderedIds });
  }, []);

  const addContent = useCallback(
    async (sectionId: number, _contentType: 'period' | 'category' | 'list') => {
      if (!resume) return;

      const section = resume.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const nextOrder = section.contents.length;

      const newContent = await window.api.resume.upsertContent({
        sectionId,
        order: nextOrder,
      });

      setResume((prev) =>
        prev
          ? {
              ...prev,
              sections: prev.sections.map((s) =>
                s.id === sectionId
                  ? { ...s, contents: [...s.contents, newContent] }
                  : s,
              ),
            }
          : prev,
      );
    },
    [resume],
  );

  const updateContent = useCallback(
    (id: number, fields: Partial<ResumeContentType>) => {
      setResume((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          sections: prev.sections.map((s) => ({
            ...s,
            contents: s.contents.map((c) =>
              c.id === id ? { ...c, ...fields } : c,
            ),
          })),
        };
        resumeRef.current = updated;
        return updated;
      });

      const existing = contentDebounceRefs.current.get(id);
      if (existing) {
        clearTimeout(existing);
      }

      const timer = setTimeout(async () => {
        // Find sectionId from the ref to avoid stale closure
        const currentResume = resumeRef.current;
        let sectionId = -1;
        if (currentResume) {
          for (const s of currentResume.sections) {
            const found = s.contents.find((c) => c.id === id);
            if (found) {
              sectionId = s.id;
              break;
            }
          }
        }
        await window.api.resume.upsertContent({ id, sectionId, ...fields });
        contentDebounceRefs.current.delete(id);
      }, 600);

      contentDebounceRefs.current.set(id, timer);
    },
    [],
  );

  const deleteContent = useCallback(async (id: number) => {
    setResume((prev) =>
      prev
        ? {
            ...prev,
            sections: prev.sections.map((s) => ({
              ...s,
              contents: s.contents.filter((c) => c.id !== id),
            })),
          }
        : prev,
    );

    await window.api.resume.deleteContent({ id });
  }, []);

  const reorderContents = useCallback(
    (sectionId: number, orderedIds: number[]) => {
      setResume((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          sections: prev.sections.map((s) => {
            if (s.id !== sectionId) return s;

            const contentMap = new Map(s.contents.map((c) => [c.id, c]));
            const reordered = orderedIds
              .map((id) => contentMap.get(id))
              .filter(Boolean) as ResumeContentType[];

            return { ...s, contents: reordered };
          }),
        };
      });

      window.api.resume.reorderContents({ orderedIds });
    },
    [],
  );

  const value: ContextType = {
    resume,
    isLoading,
    updateBasicInfo,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addContent,
    updateContent,
    deleteContent,
    reorderContents,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};
