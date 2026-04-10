import { SearchInput, Typography } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { useDatabase } from './context';

export const Panel: FunctionComponent = () => {
  const { tab, search, setSearch } = useDatabase();

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <Typography.Heading>Database</Typography.Heading>
      <SearchInput
        placeholder={tab === 'companies' ? 'Search companies' : 'Search people'}
        value={search}
        setValue={setSearch}
      />
    </div>
  );
};
