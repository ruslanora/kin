import { Drawer } from '@kin/ui';
import type { FunctionComponent } from 'react';

import { CompanyPanel } from './company-panel';
import { useDatabase } from './context';
import { PersonPanel } from './person-panel';

export const Sidebar: FunctionComponent = () => {
  const { selectedCompany, selectedContact, closeSidebar } = useDatabase();
  const isOpen = selectedCompany !== null || selectedContact !== null;

  const title = selectedCompany
    ? selectedCompany.name
    : selectedContact
      ? `${selectedContact.firstName} ${selectedContact.lastName}`
      : '';

  return (
    <Drawer state={isOpen} open={() => {}} close={closeSidebar}>
      <Drawer.Header>{title}</Drawer.Header>
      <Drawer.Body>
        {selectedCompany && <CompanyPanel key={selectedCompany.id} />}
        {selectedContact && <PersonPanel key={selectedContact.id} />}
      </Drawer.Body>
    </Drawer>
  );
};
