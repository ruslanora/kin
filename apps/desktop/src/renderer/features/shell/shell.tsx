import { Shell } from '@kin/ui';
import type { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

import { navigation } from './navigation';
import { SectionItem } from './section-item';

export const ApplicationShell: FunctionComponent = () => {
  return (
    <Shell>
      <Shell.Sidebar>
        <Shell.Sidebar.Body>
          {navigation.map((section) => (
            <Shell.Sidebar.Section
              key={`sidebar-navigation-${section.name}`}
              name={section.name}
              hidden={section.hidden}
            >
              {section.links.map((link) => (
                <SectionItem
                  key={link.href}
                  icon={link.icon}
                  name={link.name}
                  href={link.href}
                />
              ))}
            </Shell.Sidebar.Section>
          ))}
        </Shell.Sidebar.Body>
        <Shell.Sidebar.Footer>
          <ul className="w-full">
            <SectionItem icon="settings" name="Settings" href="/settings" />
          </ul>
        </Shell.Sidebar.Footer>
      </Shell.Sidebar>
      <Shell.Content>
        <Outlet />
      </Shell.Content>
    </Shell>
  );
};
