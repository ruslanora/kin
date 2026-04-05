import type {
  CompanyType,
  InterviewWithJobType,
} from '@kin/desktop/main/database';
import { Tab, Typography } from '@kin/ui';
import {
  type FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Companies } from './companies';
import { type ContactWithCompanyType, DatabaseContext } from './context';
import { People } from './people';
import { Sidebar } from './sidebar';

type TabValue = 'companies' | 'people';

export const Database: FunctionComponent = () => {
  const [tab, setTab] = useState<TabValue>('companies');
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

  const handleSetTab = useCallback((value: TabValue) => {
    setTab(value);
    setSelectedCompany(null);
    setSelectedContact(null);
  }, []);

  const context = useMemo(
    () => ({
      tab,
      setTab: handleSetTab,
      companies,
      contacts,
      allInterviews,
      selectedCompany,
      selectedContact,
      selectCompany,
      selectContact,
      closeSidebar,
      updateCompany: window.api.company.update,
      updateContact: window.api.contact.update,
    }),
    // eslint-disable-next-line
    [
      tab,
      companies,
      contacts,
      allInterviews,
      selectedCompany,
      selectedContact,
      selectCompany,
      selectContact,
      closeSidebar,
    ],
  );

  return (
    <DatabaseContext.Provider value={context}>
      <div className="h-full w-full flex flex-row overflow-hidden">
        <div className="flex flex-col items-stretch justify-start flex-1 min-w-0">
          <div className="w-full flex flex-row flex-nowrap items-center justify-between p-4 shrink-0">
            <Typography.Heading>Database</Typography.Heading>
          </div>
          <div className="mx-auto shrink-0">
            <Tab>
              <Tab.Item
                value="companies"
                selected={tab}
                setSelected={handleSetTab as (v: string) => void}
              >
                Companies
              </Tab.Item>
              <Tab.Item
                value="people"
                selected={tab}
                setSelected={handleSetTab as (v: string) => void}
              >
                People
              </Tab.Item>
            </Tab>
          </div>
          <div className="flex-1 min-h-0 w-full max-w-2xl mx-auto overflow-y-auto">
            {tab === 'companies' ? <Companies /> : <People />}
          </div>
        </div>
        <Sidebar />
      </div>
    </DatabaseContext.Provider>
  );
};
