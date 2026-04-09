import { Tab } from '@kin/ui';
import { type ComponentType, type FunctionComponent, useState } from 'react';

import { Company } from './company';
import { Contacts } from './contacts';
import { CoverLetter } from './cover-letter';
import { Interviews } from './interviews';
import { JobInfo } from './job-info';
import { Notes } from './notes';
import { Resume } from './resume';

type TabValue =
  | 'job-info'
  | 'notes'
  | 'company'
  | 'resume'
  | 'cover-letter'
  | 'interviews'
  | 'contacts';

const FULL_WIDTH_TABS = new Set<TabValue>(['resume', 'cover-letter']);

const TAB_VALUES: Array<{ key: string; name: string }> = [
  {
    key: 'job-info',
    name: 'Job Info',
  },
  {
    key: 'company',
    name: 'Company',
  },
  {
    key: 'notes',
    name: 'Notes',
  },
  {
    key: 'resume',
    name: 'Resume',
  },
  {
    key: 'cover-letter',
    name: 'Cover Letter',
  },
  {
    key: 'interviews',
    name: 'Interviews',
  },
  {
    key: 'contacts',
    name: 'Contacts',
  },
];

const TAB_CONTENT: Record<TabValue, ComponentType> = {
  'job-info': JobInfo,
  notes: Notes,
  company: Company,
  resume: Resume,
  'cover-letter': CoverLetter,
  interviews: Interviews,
  contacts: Contacts,
};

export const TabControl: FunctionComponent = () => {
  const [selected, setSelected] = useState<TabValue>('job-info');

  const Content = TAB_CONTENT[selected];

  const isFullWidth = FULL_WIDTH_TABS.has(selected);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Tab>
          {TAB_VALUES.map((record) => (
            <Tab.Item
              key={`job-page-tab-${record.key}`}
              value={record.key}
              selected={selected}
              setSelected={setSelected as (v: string) => void}
            >
              {record.name}
            </Tab.Item>
          ))}
        </Tab>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isFullWidth ? (
          <div className="h-full p-4">
            <Content />
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto p-4">
            <Content />
          </div>
        )}
      </div>
    </div>
  );
};
