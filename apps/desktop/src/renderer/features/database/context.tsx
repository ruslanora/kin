import type {
  CompanyType,
  ContactType,
  InterviewWithJobType,
} from '@kin/desktop/main/database';
import {
  createContext,
  type FunctionComponent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ContactWithCompanyType = ContactType & {
  companyName: string | null;
};

type ContextType = {
  tab: 'companies' | 'people';
  setTab: (tab: 'companies' | 'people') => void;
  search: string;
  setSearch: (value: string) => void;
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

export const DatabaseContextProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [tab, setTabState] = useState<'companies' | 'people'>('companies');
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [contacts, setContacts] = useState<ContactWithCompanyType[]>([]);
  const [allInterviews, setAllInterviews] = useState<InterviewWithJobType[]>(
    [],
  );
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    null,
  );
  const [selectedContact, setSelectedContact] =
    useState<ContactWithCompanyType | null>(null);

  useEffect(() => {
    window.api.company.getAll().then(setCompanies);
    window.api.contact.getAll().then(setContacts);
    window.api.interview.getAll().then(setAllInterviews);
  }, []);

  const selectCompany = useCallback((company: CompanyType) => {
    setSelectedCompany(company);
    setSelectedContact(null);
  }, []);

  const selectContact = useCallback((contact: ContactWithCompanyType) => {
    setSelectedContact(contact);
    setSelectedCompany(null);
  }, []);

  const closeSidebar = useCallback(() => {
    setSelectedCompany(null);
    setSelectedContact(null);
  }, []);

  const setTab = useCallback((value: 'companies' | 'people') => {
    setTabState(value);
    setSearch('');
    setSelectedCompany(null);
    setSelectedContact(null);
  }, []);

  const updateCompany = useCallback(
    async (args: { id: number; [key: string]: unknown }) => {
      const updated = await window.api.company.update(args);

      setCompanies((previous) =>
        previous.map((company) =>
          company.id === updated.id ? updated : company,
        ),
      );

      setSelectedCompany((previous) =>
        previous?.id === updated.id ? updated : previous,
      );
    },
    [],
  );

  const updateContact = useCallback(
    async (args: { id: number; [key: string]: unknown }) => {
      const updated = await window.api.contact.update(args);

      setContacts((previous) =>
        previous.map((contact) =>
          contact.id === updated.id ? { ...contact, ...updated } : contact,
        ),
      );

      setSelectedContact((previous) =>
        previous?.id === updated.id ? { ...previous, ...updated } : previous,
      );
    },
    [],
  );

  const context = useMemo(
    () => ({
      tab,
      setTab,
      search,
      setSearch,
      companies,
      contacts,
      allInterviews,
      selectedCompany,
      selectedContact,
      selectCompany,
      selectContact,
      closeSidebar,
      updateCompany,
      updateContact,
    }),
    [
      tab,
      setTab,
      search,
      setSearch,
      companies,
      contacts,
      allInterviews,
      selectedCompany,
      selectedContact,
      selectCompany,
      selectContact,
      closeSidebar,
      updateCompany,
      updateContact,
    ],
  );

  return (
    <DatabaseContext.Provider value={context}>
      {children}
    </DatabaseContext.Provider>
  );
};
