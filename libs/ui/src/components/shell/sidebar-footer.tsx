'use client';

import type { FunctionComponent, ReactNode } from 'react';

type PropsType = {
  children?: ReactNode;
};

export const ShellSidebarFooter: FunctionComponent<PropsType> = ({
  children,
}) => {
  return (
    <div className="w-full px-2">
      <div className="w-full flex flex-col items-stretch justify-start py-2 border-t border-stone-200 dark:border-stone-800">
        {children}
      </div>
    </div>
  );
};

ShellSidebarFooter.displayName = 'Shell.Sidebar.Footer';
