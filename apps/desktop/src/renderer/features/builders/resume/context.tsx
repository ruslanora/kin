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
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type ResumeSettingsType = { spacingMultiplier: number };

type ResumeContextType = {
  resume: ResumeWithSectionsType | null;
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

/**
 * Resume context — provides all resume state and update functions to the
 * builder UI. Use the `useResume()` hook to access these from any child.
 *
 * The "patch" variants (patchBasicInfo, patchSection, patchContent) update
 * local React state immediately for a snappy UI. The "update" variants also
 * persist the change to the database via IPC, usually with a debounce so we
 * don't hammer the DB on every keystroke.
 */
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

  useEffect(() => {
    return () => {
      if (basicInfoDebounceRef.current) {
        clearTimeout(basicInfoDebounceRef.current);
      }
    };
  }, []);

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
              sections: prev.sections.map((section) =>
                section.id === id ? { ...section, ...fields } : section,
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
              sections: prev.sections.map((section) =>
                section.id === id ? { ...section, ...fields } : section,
              ),
            }
          : prev,
      );

      const section = resume.sections.find((section) => section.id === id);
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
            sections: prev.sections.filter((section) => section.id !== id),
          }
        : prev,
    );

    await window.api.resume.deleteSection({ id });
  }, []);

  const reorderSections = useCallback((orderedIds: number[]) => {
    setResume((prev) => {
      if (!prev) return prev;

      const sectionMap = new Map(
        prev.sections.map((section) => [section.id, section]),
      );
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

      const section = resume.sections.find(
        (section) => section.id === sectionId,
      );
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
              sections: prev.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, contents: [...section.contents, newContent] }
                  : section,
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
          sections: prev.sections.map((section) => ({
            ...section,
            contents: section.contents.map((content) =>
              content.id === id ? { ...content, ...fields } : content,
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
        for (const section of currentResume.sections) {
          if (section.contents.find((content) => content.id === id)) {
            sectionId = section.id;
            break;
          }
        }
      }
      if (sectionId === -1) return;
      window.api.resume.upsertContent({ id, sectionId, ...fields });
    },
    [],
  );

  const deleteContent = useCallback(async (id: number) => {
    setResume((prev) =>
      prev
        ? {
            ...prev,
            sections: prev.sections.map((section) => ({
              ...section,
              contents: section.contents.filter((content) => content.id !== id),
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
          sections: prev.sections.map((section) => {
            if (section.id !== sectionId) return section;

            const contentMap = new Map(
              section.contents.map((content) => [content.id, content]),
            );
            const reordered = orderedIds
              .map((id) => contentMap.get(id))
              .filter(Boolean) as ResumeContentType[];

            return { ...section, contents: reordered };
          }),
        };
      });

      window.api.resume.reorderContents({ orderedIds });
    },
    [],
  );

  const value: ResumeContextType = {
    resume,
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
