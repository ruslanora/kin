'use client';

import { type FunctionComponent, type ReactNode, useState } from 'react';

import { ShellContent } from './content';
import { ShellContext } from './context';
import { ShellSidebar } from './sidebar';

type PropsType = {
  children?: ReactNode;
};

const ShellComponent: FunctionComponent<PropsType> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <ShellContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex flex-row h-full w-full">{children}</div>
    </ShellContext.Provider>
  );
};

ShellComponent.displayName = 'Shell';

export const Shell = Object.assign(ShellComponent, {
  Content: ShellContent,
  Sidebar: ShellSidebar,
});
