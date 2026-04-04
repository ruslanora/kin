'use client';

import { classNames } from '@kin/ui/utils';
import type { FunctionComponent, ReactNode } from 'react';

import { useShell } from './context';

type PropsType = {
  name?: string;
  hidden?: boolean;
  children?: ReactNode;
};

export const ShellSidebarSection: FunctionComponent<PropsType> = ({
  name,
  hidden,
  children,
}) => {
  const { collapsed } = useShell();

  return (
    <div
      className={classNames(
        'w-full flex flex-col items-stretch justify-start pb-2',
        'transition-all duration-300 ease-in-out',
        hidden && collapsed && 'opacity-0',
      )}
    >
      {name && (
        <h3
          className={classNames(
            'pb-2 pl-2',
            'text-stone-400 dark:text-stone-600',
            'text-[9px] font-bold uppercase whitespace-nowrap tracking-wider',
            'transition-all duration-300 ease-in-out',
            collapsed ? 'opacity-0' : 'opacity-100',
          )}
        >
          {name}
        </h3>
      )}
      <ul className="flex flex-col items-stretch justify-start gap-1 cursor-pointer">
        {children}
      </ul>
    </div>
  );
};

ShellSidebarSection.displayName = 'Shell.Sidebar.Section';
