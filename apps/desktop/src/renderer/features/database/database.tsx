import { Tab } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { Companies } from './companies';
import { useDatabase } from './context';
import { People } from './people';
import { Sidebar } from './sidebar';

export const Database: FunctionComponent = () => {
  const { tab, setTab } = useDatabase();

  return (
    <div className="h-full w-full flex flex-row overflow-hidden">
      <div className="flex flex-col items-stretch justify-start flex-1 min-w-0">
        <div className="mx-auto shrink-0">
          <Tab>
            <Tab.Item
              value="companies"
              selected={tab}
              setSelected={setTab as (value: string) => void}
            >
              Companies
            </Tab.Item>
            <Tab.Item
              value="people"
              selected={tab}
              setSelected={setTab as (value: string) => void}
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
  );
};
