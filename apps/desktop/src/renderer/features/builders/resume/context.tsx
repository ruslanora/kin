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
  useMemo,
  useRef,
  useState,
} from 'react';

export type ResumeSettingsType = { spacingMultiplier: number };

type ResumeContextType = {
  resume: ResumeWithSectionsType | null;
  isLoading: boolean;
  parsedSettings: ResumeSettingsType;
  patchBasicInfo: (fields: Partial<ResumeType>) => void;
  updateBasicInfo: (fields: Partial<ResumeType>) => void;
  updateDesign: (design: string) => void;
  updateSettings: (patch: Partial<ResumeSettingsType>) => void;
  addSection: (
    contentType: 'period' | 'category' | 'list',
    name: string,
    preset?: string,
  ) => Promise<void>;
  patchSection: (id: number, fields: Partial<ResumeSectionType>) => void;
  updateSection: (id: number, fields: Partial<ResumeSectionType>) => void;
  deleteSection: (id: number) => Promise<void>;
  reorderSections: (orderedIds: number[]) => void;
  addContent: (
    sectionId: number,
    contentType: 'period' | 'category' | 'list',
  ) => Promise<void>;
  patchContent: (id: number, fields: Partial<ResumeContentType>) => void;
  updateContent: (id: number, fields: Partial<ResumeContentType>) => void;
  deleteContent: (id: number) => Promise<void>;
  reorderContents: (sectionId: number, orderedIds: number[]) => void;
};

type ProviderPropsType = {
  initialResume: ResumeWithSectionsType;
  children: ReactNode;
};

export const ResumeContext = createContext<ResumeContextType | null>(null);

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error('useResume must be called within ResumeContext provider!');
  }

  return context;
};

export const ResumeProvider: FunctionComponent<ProviderPropsType> = ({
  initialResume,
  children,
}) => {
  const [resume, setResume] = useState<ResumeWithSectionsType | null>(
    initialResume,
  );
  const [isLoading] = useState(false);

  const parsedSettings = useMemo<ResumeSettingsType>(() => {
    try {
      const raw = JSON.parse(resume?.settings ?? '{}');
      return { spacingMultiplier: 1.0, ...raw };
    } catch {
      return { spacingMultiplier: 1.0 };
    }
  }, [resume?.settings]);

  const resumeRef = useRef<ResumeWithSectionsType | null>(initialResume);
  const basicInfoDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const patchBasicInfo = useCallback((fields: Partial<ResumeType>) => {
    setResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...fields };
      resumeRef.current = updated;
      return updated;
    });
  }, []);

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

  const updateDesign = useCallback(
    (design: string) => {
      updateBasicInfo({ design });
    },
    [updateBasicInfo],
  );

  const updateSettings = useCallback(
    (patch: Partial<ResumeSettingsType>) => {
      const current = (() => {
        try {
          return JSON.parse(resumeRef.current?.settings ?? '{}');
        } catch {
          return {};
        }
      })();
      const merged = { spacingMultiplier: 1.0, ...current, ...patch };
      updateBasicInfo({ settings: JSON.stringify(merged) });
    },
    [updateBasicInfo],
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
        order: resume.sections.length,
        contentType,
        preset,
      });

      const newContent = await window.api.resume.upsertContent({
        sectionId: newSection.id,
        order: 0,
      });
      const initialContents: ResumeContentType[] = [newContent];

      setResume((prev) =>
        prev
          ? {
              ...prev,
              sections: [
                ...prev.sections,
                { ...newSection, contents: initialContents },
              ],
            }
          : prev,
      );
    },
    [resume],
  );

  const patchSection = useCallback(
    (id: number, fields: Partial<ResumeSectionType>) => {
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
    },
    [],
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

  const patchContent = useCallback(
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
    },
    [],
  );

  const updateContent = useCallback(
    (id: number, fields: Partial<ResumeContentType>) => {
      // Find sectionId from the ref to avoid stale closure
      let sectionId = -1;
      const currentResume = resumeRef.current;
      if (currentResume) {
        for (const s of currentResume.sections) {
          if (s.contents.find((c) => c.id === id)) {
            sectionId = s.id;
            break;
          }
        }
      }
      window.api.resume.upsertContent({ id, sectionId, ...fields });
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

  const value: ResumeContextType = {
    resume,
    isLoading,
    parsedSettings,
    patchBasicInfo,
    updateBasicInfo,
    updateDesign,
    updateSettings,
    addSection,
    patchSection,
    updateSection,
    deleteSection,
    reorderSections,
    addContent,
    patchContent,
    updateContent,
    deleteContent,
    reorderContents,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};
