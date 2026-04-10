import { classNames } from '@kin/ui';
import { type FunctionComponent, useMemo } from 'react';

import { useDatabase } from './context';
import { groupByLetter } from './utils';

export const People: FunctionComponent = () => {
  const { contacts, selectedContact, selectContact, search } = useDatabase();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return q
      ? contacts.filter(
          (contact) =>
            `${contact.firstName} ${contact.lastName}`
              .toLowerCase()
              .includes(q) ||
            (contact.companyName?.toLowerCase().includes(q) ?? false),
        )
      : contacts;
  }, [contacts, search]);

  const groups = useMemo(
    () => groupByLetter(filtered, (contact) => contact.lastName),
    [filtered],
  );

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col">
        {groups.map(({ letter, items }) => (
          <div key={`people-${letter}`}>
            <div className="px-2 py-1 text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              {letter}
            </div>
            {items.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => selectContact(contact)}
                className={classNames(
                  'w-full text-left px-2 py-2 rounded-md transition-colors',
                  'cursor-pointer',
                  selectedContact?.id === contact.id
                    ? 'bg-stone-200 dark:bg-stone-700'
                    : 'hover:bg-stone-100 dark:hover:bg-stone-800',
                )}
              >
                <span className="text-sm text-stone-800 dark:text-stone-200 truncate block">
                  {contact.firstName} {contact.lastName}
                </span>
                {(contact.title || contact.companyName) && (
                  <span className="text-xs text-stone-400 dark:text-stone-500 truncate block">
                    {[contact.title, contact.companyName]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
        {groups.length === 0 && (
          <div className="px-2 py-4 text-sm text-stone-400 dark:text-stone-500 text-center">
            No people found
          </div>
        )}
      </div>
    </div>
  );
};
