import type {
  CoverLetterType,
  ResumeContentType,
  ResumeSectionType,
  ResumeWithSectionsType,
} from '@kin/desktop/main/database';
import type { ReactNode } from 'react';

export type DesignDefinitionType = {
  id: string;
  label: string;
  css: string;
};

export type SectionChunkType = {
  section: ResumeSectionType & { contents: Array<ResumeContentType> };
  contentRange: [number, number];
  showSectionHeading: boolean;
};

export type PageContentType = {
  header?: true;
  chunks: Array<SectionChunkType>;
};

export type CoverLetterContextType = {
  coverLetter: CoverLetterType | null;
  isLoading: boolean;
  patchContent: (content: string) => void;
  updateContent: (content: string) => void;
};

export type CoverLetterProviderPropsType = {
  initialCoverLetter: CoverLetterType;
  children: ReactNode;
};

export type CoverLetterDocumentPropsType = {
  resume: ResumeWithSectionsType;
  content: string;
  spacingMultiplier: number;
  design: string;
};

export type CoverLetterHeaderPropsType = {
  resume: ResumeWithSectionsType;
};

export type CoverLetterDesignPickerPropsType = {
  spacingMultiplier: number;
  design: string;
  onDesignChange: (design: string) => void;
  onSpacingChange: (spacing: number) => void;
};
