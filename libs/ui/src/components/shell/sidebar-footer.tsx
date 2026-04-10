'use client';

import { classNames } from '@kin/ui';
import type { FunctionComponent, ReactNode } from 'react';

import { useShell } from './context';

type PropsType = {
  children?: ReactNode;
};

export const ShellSidebarFooter: FunctionComponent<PropsType> = ({
  children,
}) => {
  const { collapsed } = useShell();

  return (
    <div
      className={classNames(
        'w-full px-2',
        collapsed ? 'opacity-0' : 'opacity-100',
        'transition-all duration-300 ease-in-out',
      )}
    >
      <div className="w-full flex flex-col items-stretch justify-start py-2">
        {children}
      </div>
    </div>
  );
};

ShellSidebarFooter.displayName = 'Shell.Sidebar.Footer';
