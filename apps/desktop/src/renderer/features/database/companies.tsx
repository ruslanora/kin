import { Badge, classNames, SearchInput } from '@kin/ui';
import { type FunctionComponent, useMemo, useState } from 'react';

import { useDatabase } from './context';
import { groupByLetter } from './utils';

export const Companies: FunctionComponent = () => {
  const { companies, selectedCompany, selectCompany } = useDatabase();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return q
      ? companies.filter((company) => company.name.toLowerCase().includes(q))
      : companies;
  }, [companies, search]);

  const groups = useMemo(
    () => groupByLetter(filtered, (company) => company.name),
    [filtered],
  );

  return (
    <div className="flex flex-col gap-2 p-4">
      <SearchInput
        placeholder="Search companies"
        value={search}
        setValue={setSearch}
      />
      <div className="flex flex-col">
        {groups.map(({ letter, items }) => (
          <div key={`companies-${letter}`}>
            <div className="px-2 py-1 text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              {letter}
            </div>
            {items.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => selectCompany(company)}
                className={classNames(
                  'w-full text-left px-2 py-2 rounded-md transition-colors',
                  'cursor-pointer',
                  selectedCompany?.id === company.id
                    ? 'bg-stone-200 dark:bg-stone-700'
                    : 'hover:bg-stone-100 dark:hover:bg-stone-800',
                )}
              >
                <div className="flex flex-row items-center justify-start gap-2">
                  <span className="text-sm text-stone-800 dark:text-stone-200 truncate block">
                    {company.name}
                  </span>
                  {company.isToAvoid && <Badge variant="danger">Avoid</Badge>}
                </div>
                {company.industry && (
                  <span className="text-xs text-stone-400 dark:text-stone-500 truncate block">
                    {company.industry}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
        {groups.length === 0 && (
          <div className="px-2 py-4 text-sm text-stone-400 dark:text-stone-500 text-center">
            No companies found
          </div>
        )}
      </div>
    </div>
  );
};
