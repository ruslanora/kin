'use client';

import { classNames } from '@kin/ui';
import { type FunctionComponent, type ReactNode, useState } from 'react';

import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { useShell } from './context';
import { Logo } from './logo';
import { ShellSidebarBody } from './sidebar-body';
import { ShellSidebarFooter } from './sidebar-footer';
import { ShellSidebarSection } from './sidebar-section';

type PropsType = {
  children?: ReactNode;
};

const ShellSidebarComponent: FunctionComponent<PropsType> = ({ children }) => {
  const { collapsed, setCollapsed } = useShell();

  const [logoHovered, setLogoHovered] = useState<boolean>(false);

  return (
    <aside
      className={classNames(
        'h-full flex flex-col items-stretch justify-start shrink-0',
        'bg-stone-100 border-r border-r-stone-200 dark:bg-stone-900 dark:border-r-stone-800',
        'transition-all duration-300 ease-in-out',
        'overflow-hidden',
        collapsed ? 'w-14 cursor-pointer' : 'w-64',
      )}
    >
      <div className="w-full flex flex-row items-center justify-between shrink-0 p-2 pt-4">
        {collapsed ? (
          <button
            type="button"
            className={classNames(
              'relative h-10 w-10 rounded-md',
              'text-stone-400 bg-transparent hover:text-stone-500 hover:bg-stone-200 dark:text-stone-500 dark:hover:text-stone-400 dark:hover:bg-stone-800',
              'focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700',
              'flex items-center justify-center shrink-0',
              'transition-all duration-300 ease-in-out',
              'cursor-pointer',
            )}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            onClick={(event) => {
              event.stopPropagation();
              setCollapsed(false);
              setLogoHovered(false);
            }}
          >
            <span
              className={classNames(
                'h-10 w-10',
                'flex items-center justify-center shrink-0',
                logoHovered ? 'opacity-0' : 'opacity-100',
              )}
            >
              <Logo size={18} />
            </span>
            <span
              className={classNames(
                'z-10 absolute h-10 w-10 inset-0',
                'flex items-center justify-center shrink-0',
                logoHovered ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Icon name="sidebar" size={18} />
            </span>
          </button>
        ) : (
          <>
            <div
              className={classNames(
                'h-10 w-10',
                'flex items-center justify-center shrink-0',
              )}
            >
              <Logo size={18} />
            </div>
            <IconButton
              icon="sidebar"
              onClick={() => {
                setLogoHovered(false);
                setCollapsed(true);
              }}
            />
          </>
        )}
      </div>
      {children}
    </aside>
  );
};

ShellSidebarComponent.displayName = 'Shell.Sidebar';

export const ShellSidebar = Object.assign(ShellSidebarComponent, {
  Body: ShellSidebarBody,
  Footer: ShellSidebarFooter,
  Section: ShellSidebarSection,
});
