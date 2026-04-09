import type { CoverLetterType } from '@kin/desktop/main/database';
import {
  createContext,
  type FunctionComponent,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

type CoverLetterContextType = {
  coverLetter: CoverLetterType | null;
  isLoading: boolean;
  patchContent: (content: string) => void;
  updateContent: (content: string) => void;
};

type ProviderPropsType = {
  initialCoverLetter: CoverLetterType;
  children: ReactNode;
};

export const CoverLetterContext = createContext<CoverLetterContextType | null>(
  null,
);

export const useCoverLetter = (): CoverLetterContextType => {
  const context = useContext(CoverLetterContext);

  if (!context) {
    throw new Error(
      'useCoverLetter must be called within CoverLetterContext provider!',
    );
  }

  return context;
};

export const CoverLetterProvider: FunctionComponent<ProviderPropsType> = ({
  initialCoverLetter,
  children,
}) => {
  const [coverLetter, setCoverLetter] = useState<CoverLetterType | null>(
    initialCoverLetter,
  );
  const [isLoading] = useState(false);

  const coverLetterRef = useRef<CoverLetterType | null>(initialCoverLetter);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const patchContent = useCallback((content: string) => {
    setCoverLetter((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, content };
      coverLetterRef.current = updated;

      return updated;
    });
  }, []);

  const updateContent = useCallback((content: string) => {
    const current = coverLetterRef.current;

    if (!current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      await window.api.coverLetter.update({ id: current.id, content });
    }, 600);
  }, []);

  const value: CoverLetterContextType = {
    coverLetter,
    isLoading,
    patchContent,
    updateContent,
  };

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
};
