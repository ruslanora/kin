import type {
  CompanyType,
  ContactType,
  InterviewWithJobType,
} from '@kin/desktop/main/database';
import { createContext, useContext } from 'react';

export type ContactWithCompanyType = ContactType & {
  companyName: string | null;
};

type ContextType = {
  tab: 'companies' | 'people';
  setTab: (tab: 'companies' | 'people') => void;
  companies: CompanyType[];
  contacts: ContactWithCompanyType[];
  allInterviews: InterviewWithJobType[];
  selectedCompany: CompanyType | null;
  selectedContact: ContactWithCompanyType | null;
  selectCompany: (company: CompanyType) => void;
  selectContact: (contact: ContactWithCompanyType) => void;
  closeSidebar: () => void;
  updateCompany: (args: {
    id: number;
    [key: string]: unknown;
  }) => Promise<void>;
  updateContact: (args: {
    id: number;
    [key: string]: unknown;
  }) => Promise<void>;
};

export const DatabaseContext = createContext<ContextType | null>(null);

export const useDatabase = (): ContextType => {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error(
      'useDatabase must be used within DatabaseContext provider!',
    );
  }

  return context;
};
